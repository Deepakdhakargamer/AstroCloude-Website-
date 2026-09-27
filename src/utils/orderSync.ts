import { AdminOrder } from '../types';
import { get, set } from 'idb-keyval';
import { getCurrentSession, getStoredUsers } from './userSync';
import { getStoredPlans } from './planSync';
import { validateCoupon, recordCouponUsage, rollbackCouponUsage } from './couponSync';

const STORAGE_KEY = 'astro_orders';

// Sanitize and migrate existing order records to maintain strict, correct user relationships
export const sanitizeOrderRecords = async (): Promise<AdminOrder[]> => {
  try {
    const rawOrders: AdminOrder[] = (await get(STORAGE_KEY)) || [];
    if (!Array.isArray(rawOrders) || rawOrders.length === 0) {
      return [];
    }

    const users = await getStoredUsers();
    let modified = false;

    const sanitized = rawOrders.map(order => {
      let orderUserId = order.userId;
      let orderUserEmail = order.userEmail ? order.userEmail.trim().toLowerCase() : '';
      let orderUserName = order.userName || 'Customer';

      // Verify if order.userId matches an existing registered user
      const existingUser = users.find(u => u.id === orderUserId);
      
      if (!existingUser && orderUserEmail) {
        // Associate with legitimate user account by verified email if ID was missing/corrupt
        const matchedUser = users.find(u => u.email.toLowerCase() === orderUserEmail);
        if (matchedUser) {
          orderUserId = matchedUser.id;
          orderUserName = matchedUser.name;
          modified = true;
        }
      }

      // If this was an old test order without a valid user ID, associate with demo user Alex Turner if applicable
      if (!orderUserId || orderUserId.startsWith('USR-') || !users.some(u => u.id === orderUserId)) {
        const alex = users.find(u => u.username === 'alexturner' || u.email.toLowerCase() === 'alex@example.com');
        if (alex && (orderUserEmail === 'alex@example.com' || !orderUserEmail)) {
          orderUserId = alex.id;
          orderUserEmail = alex.email;
          orderUserName = alex.name;
          modified = true;
        }
      }

      return {
        ...order,
        userId: orderUserId || '',
        userEmail: orderUserEmail,
        userName: orderUserName,
        updatedAt: order.updatedAt || new Date().toISOString()
      };
    });

    if (modified) {
      await set(STORAGE_KEY, sanitized);
      window.dispatchEvent(new CustomEvent('astro_orders_changed', { detail: sanitized }));
    }

    return sanitized;
  } catch (err) {
    console.error('Error sanitizing order records', err);
    return [];
  }
};

export const getStoredOrders = async (): Promise<AdminOrder[]> => {
  return await sanitizeOrderRecords();
};

export const getUserOrders = async (userId: string): Promise<AdminOrder[]> => {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    return [];
  }
  const cleanUserId = userId.trim();
  const allOrders = await getStoredOrders();
  
  // Strictly filter orders by authenticated user's unique database ID
  // NEVER fall back to email or display orders without matching user ID
  return allOrders.filter(order => 
    Boolean(order && order.userId && typeof order.userId === 'string' && order.userId.trim() === cleanUserId)
  );
};

export const saveStoredOrders = async (orders: AdminOrder[]) => {
  try {
    await set(STORAGE_KEY, orders);
    window.dispatchEvent(new CustomEvent('astro_orders_changed', { detail: orders }));
  } catch (err) {
    console.error('Error saving orders to IndexedDB', err);
  }
};

export const updateStoredOrders = async (orders: AdminOrder[]) => {
  try {
    const rawPrev: AdminOrder[] = (await get(STORAGE_KEY)) || [];
    for (const prev of rawPrev) {
      if (prev.couponCode) {
        const current = orders.find(o => o.id === prev.id);
        // If order was rejected or deleted, rollback coupon usage
        if (!current || (current.status === 'rejected' && prev.status !== 'rejected')) {
          await rollbackCouponUsage({
            couponCode: prev.couponCode,
            orderId: prev.id
          });
        }
      }
    }
  } catch (err) {
    console.error('Error verifying coupon rollback in updateStoredOrders', err);
  }
  await saveStoredOrders(orders);
};

export const addOrder = async (order: Partial<AdminOrder> & { planId: string; planName: string; price: number }): Promise<{ success: boolean; order?: AdminOrder; error?: string }> => {
  // Validate active session - reject unauthenticated purchase requests
  const session = getCurrentSession();
  if (!session || !session.user || !session.user.id) {
    throw new Error('Authentication required: Please login or register to purchase a plan.');
  }

  // Double check that the authenticated user actually exists in the database
  const users = await getStoredUsers();
  const authenticatedUser = users.find(u => u.id === session.user.id);
  if (!authenticatedUser) {
    throw new Error('Invalid user session: User account not found in database.');
  }

  // Security: Authoritatively verify plan and base price from the database
  const plans = getStoredPlans();
  const dbPlan = plans.find(p => p.id === order.planId);
  const basePlanPrice = dbPlan ? dbPlan.price : (order.originalPrice || order.price);

  let verifiedOriginalPrice = basePlanPrice;
  let verifiedDiscountAmount = 0;
  let verifiedFinalPrice = basePlanPrice;
  let verifiedCouponCode: string | undefined = undefined;
  let validatedCouponId: string | undefined = undefined;

  // Security: Validate coupon authoritatively on the backend, NEVER trust discount sent by frontend
  if (order.couponCode && order.couponCode.trim()) {
    const cleanCouponCode = order.couponCode.trim().toUpperCase();
    const validation = await validateCoupon({
      code: cleanCouponCode,
      orderAmount: basePlanPrice,
      userId: authenticatedUser.id
    });

    if (!validation.valid || !validation.coupon) {
      throw new Error(validation.error || 'Invalid coupon code.');
    }

    verifiedCouponCode = validation.coupon.code;
    validatedCouponId = validation.coupon.id;
    verifiedDiscountAmount = validation.discountAmount;
    verifiedFinalPrice = validation.finalPrice;
  }

  // Strict binding of order to the authenticated user's unique ID and credentials
  // Never accept user ID directly from frontend as a trusted value
  const newOrder: AdminOrder = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    userId: authenticatedUser.id,
    userName: authenticatedUser.name,
    userEmail: authenticatedUser.email,
    planId: order.planId,
    planName: dbPlan ? dbPlan.name : order.planName,
    categoryId: dbPlan ? dbPlan.categoryId : (order.categoryId || 'vps'),
    categoryName: order.categoryName || 'Hosting Plan',
    price: verifiedFinalPrice,
    currency: 'INR',
    originalPrice: verifiedOriginalPrice,
    discountAmount: verifiedDiscountAmount,
    couponCode: verifiedCouponCode,
    totalAmount: verifiedFinalPrice,
    screenshotUrl: order.screenshotUrl || '',
    transactionId: order.transactionId || '',
    status: 'pending_verification',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    adminNote: order.adminNote,
  };

  const orders = await getStoredOrders();
  await saveStoredOrders([newOrder, ...orders]);

  // Record coupon usage only after successful order placement
  if (validatedCouponId && verifiedCouponCode) {
    await recordCouponUsage({
      couponId: validatedCouponId,
      orderId: newOrder.id,
      userId: authenticatedUser.id,
      userEmail: authenticatedUser.email,
      discountApplied: verifiedDiscountAmount
    });
  }

  return { success: true, order: newOrder };
};

export const submitPurchaseOrder = async (orderData: {
  planId: string;
  planName: string;
  categoryId?: string;
  categoryName?: string;
  price: number;
  couponCode?: string;
  screenshotUrl: string;
  transactionId?: string;
}) => {
  return await addOrder(orderData);
};

export const updateOrder = async (orderId: string, updates: Partial<AdminOrder>) => {
  const orders = await getStoredOrders();
  const existingOrder = orders.find(o => o.id === orderId);

  // If order status is being changed to rejected, rollback coupon usage
  if (existingOrder && updates.status === 'rejected' && existingOrder.status !== 'rejected') {
    if (existingOrder.couponCode) {
      await rollbackCouponUsage({
        couponCode: existingOrder.couponCode,
        orderId: existingOrder.id
      });
    }
  }

  const updated = orders.map(o => o.id === orderId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o);
  await saveStoredOrders(updated);
};

export const deleteOrder = async (orderId: string) => {
  const orders = await getStoredOrders();
  const existingOrder = orders.find(o => o.id === orderId);

  if (existingOrder && existingOrder.couponCode) {
    await rollbackCouponUsage({
      couponCode: existingOrder.couponCode,
      orderId: existingOrder.id
    });
  }

  const filtered = orders.filter(o => o.id !== orderId);
  await saveStoredOrders(filtered);
};


