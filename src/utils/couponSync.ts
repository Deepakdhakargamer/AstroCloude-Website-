import { get, set } from 'idb-keyval';
import { AdminCoupon, CouponUsageRecord } from '../types';

const STORAGE_KEY = 'astro_coupons';

const INITIAL_COUPONS: AdminCoupon[] = [
  {
    id: 'cpn-welcome10',
    code: 'WELCOME10',
    description: 'Welcome bonus 10% off for all hosting servers',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 100,
    maxDiscountAmount: 100,
    usageLimit: 100,
    perUserLimit: 1,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    active: true,
    usesCount: 0,
    usedBy: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cpn-astro20',
    code: 'ASTRO20',
    description: 'Special 20% discount on cloud VPS & game servers',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 200,
    maxDiscountAmount: 400,
    usageLimit: 50,
    perUserLimit: 1,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    active: true,
    usesCount: 0,
    usedBy: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cpn-flat100',
    code: 'FLAT100',
    description: 'Instant flat ₹100 off on high-performance plans',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 400,
    usageLimit: 30,
    perUserLimit: 1,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    active: true,
    usesCount: 0,
    usedBy: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cpn-expired50',
    code: 'EXPIRED50',
    description: 'Expired test promotion coupon',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 100,
    usageLimit: 10,
    perUserLimit: 1,
    startDate: '2025-01-01',
    expiryDate: '2025-12-31',
    active: true,
    usesCount: 0,
    usedBy: [],
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-01-01').toISOString()
  }
];

export const getStoredCoupons = async (): Promise<AdminCoupon[]> => {
  try {
    const data = await get(STORAGE_KEY);
    if (!data || !Array.isArray(data) || data.length === 0) {
      await set(STORAGE_KEY, INITIAL_COUPONS);
      return INITIAL_COUPONS;
    }
    return data;
  } catch (err) {
    console.error('Error fetching coupons from storage', err);
    return INITIAL_COUPONS;
  }
};

export const saveStoredCoupons = async (coupons: AdminCoupon[]): Promise<void> => {
  try {
    await set(STORAGE_KEY, coupons);
    window.dispatchEvent(new CustomEvent('astro_coupons_changed', { detail: coupons }));
  } catch (err) {
    console.error('Error saving coupons to storage', err);
  }
};

export const createCoupon = async (
  couponData: Omit<AdminCoupon, 'id' | 'usesCount' | 'usedBy' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; coupon?: AdminCoupon; error?: string }> => {
  try {
    const cleanCode = couponData.code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: 'Coupon code cannot be empty.' };
    }

    if (couponData.discountValue <= 0) {
      return { success: false, error: 'Discount value must be greater than zero.' };
    }

    if (couponData.discountType === 'percentage' && couponData.discountValue > 100) {
      return { success: false, error: 'Percentage discount cannot exceed 100%.' };
    }

    const coupons = await getStoredCoupons();
    if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
      return { success: false, error: `Coupon code "${cleanCode}" already exists.` };
    }

    const newCoupon: AdminCoupon = {
      ...couponData,
      id: 'cpn-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7),
      code: cleanCode,
      usesCount: 0,
      usedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newCoupon, ...coupons];
    await saveStoredCoupons(updated);
    return { success: true, coupon: newCoupon };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create coupon.' };
  }
};

export const updateCoupon = async (
  id: string,
  updates: Partial<AdminCoupon>
): Promise<{ success: boolean; coupon?: AdminCoupon; error?: string }> => {
  try {
    const coupons = await getStoredCoupons();
    const existingIndex = coupons.findIndex(c => c.id === id);
    if (existingIndex === -1) {
      return { success: false, error: 'Coupon not found.' };
    }

    if (updates.code) {
      const cleanCode = updates.code.trim().toUpperCase();
      const duplicate = coupons.find(c => c.id !== id && c.code.toUpperCase() === cleanCode);
      if (duplicate) {
        return { success: false, error: `Coupon code "${cleanCode}" is already in use by another coupon.` };
      }
      updates.code = cleanCode;
    }

    if (updates.discountValue !== undefined && updates.discountValue <= 0) {
      return { success: false, error: 'Discount value must be greater than zero.' };
    }

    if (updates.discountType === 'percentage' && updates.discountValue !== undefined && updates.discountValue > 100) {
      return { success: false, error: 'Percentage discount cannot exceed 100%.' };
    }

    const updatedCoupon: AdminCoupon = {
      ...coupons[existingIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    coupons[existingIndex] = updatedCoupon;
    await saveStoredCoupons(coupons);
    return { success: true, coupon: updatedCoupon };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update coupon.' };
  }
};

export const deleteCoupon = async (id: string): Promise<boolean> => {
  try {
    const coupons = await getStoredCoupons();
    const filtered = coupons.filter(c => c.id !== id);
    await saveStoredCoupons(filtered);
    return true;
  } catch (err) {
    console.error('Error deleting coupon', err);
    return false;
  }
};

export const toggleCouponStatus = async (id: string): Promise<boolean> => {
  try {
    const coupons = await getStoredCoupons();
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return false;
    coupon.active = !coupon.active;
    coupon.updatedAt = new Date().toISOString();
    await saveStoredCoupons(coupons);
    return true;
  } catch (err) {
    console.error('Error toggling coupon', err);
    return false;
  }
};

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  coupon?: AdminCoupon;
  discountAmount: number;
  finalPrice: number;
}

/**
 * Backend Authoritative Coupon Validation
 * Checks existence, active status, date range, overall limit, per-user limit, and min order requirement.
 * Calculates discount and ensures final amount >= 0.
 */
export const validateCoupon = async (params: {
  code: string;
  orderAmount: number;
  userId?: string;
}): Promise<CouponValidationResult> => {
  const { code, orderAmount, userId } = params;
  const cleanCode = (code || '').trim().toUpperCase();

  if (!cleanCode) {
    return {
      valid: false,
      error: 'Please enter a coupon code.',
      discountAmount: 0,
      finalPrice: orderAmount
    };
  }

  const coupons = await getStoredCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return {
      valid: false,
      error: 'Invalid coupon code',
      discountAmount: 0,
      finalPrice: orderAmount
    };
  }

  // 1. Active status check
  if (!coupon.active) {
    return {
      valid: false,
      error: 'Coupon is not active',
      discountAmount: 0,
      finalPrice: orderAmount
    };
  }

  const now = new Date();

  // 2. Start Date check
  if (coupon.startDate) {
    const start = new Date(coupon.startDate);
    // Compare date parts or full time
    if (now < start) {
      return {
        valid: false,
        error: 'Coupon has not started yet',
        discountAmount: 0,
        finalPrice: orderAmount
      };
    }
  }

  // 3. Expiry Date check
  if (coupon.expiryDate) {
    // Treat expiry date as inclusive of that day's end if date-only format
    const expiry = new Date(coupon.expiryDate);
    if (coupon.expiryDate.length === 10) {
      expiry.setHours(23, 59, 59, 999);
    }
    if (now > expiry) {
      return {
        valid: false,
        error: 'Coupon has expired',
        discountAmount: 0,
        finalPrice: orderAmount
      };
    }
  }

  // 4. Overall Usage Limit check
  if (coupon.usageLimit && coupon.usageLimit > 0) {
    if (coupon.usesCount >= coupon.usageLimit) {
      return {
        valid: false,
        error: 'Coupon usage limit has been reached',
        discountAmount: 0,
        finalPrice: orderAmount
      };
    }
  }

  // 5. Minimum Order Requirement check
  if (coupon.minOrderAmount && coupon.minOrderAmount > 0) {
    if (orderAmount < coupon.minOrderAmount) {
      return {
        valid: false,
        error: `Minimum order amount is ₹${coupon.minOrderAmount}`,
        discountAmount: 0,
        finalPrice: orderAmount
      };
    }
  }

  // 6. Per-User Usage Limit check
  const perUserLimit = coupon.perUserLimit || 1;
  if (userId && coupon.usedBy && Array.isArray(coupon.usedBy)) {
    const userUsages = coupon.usedBy.filter(u => u.userId === userId).length;
    if (userUsages >= perUserLimit) {
      return {
        valid: false,
        error: 'You have already used this coupon',
        discountAmount: 0,
        finalPrice: orderAmount
      };
    }
  }

  // 7. Calculate Discount Amount
  let calculatedDiscount = 0;
  if (coupon.discountType === 'percentage') {
    let rawDiscount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
      rawDiscount = Math.min(rawDiscount, coupon.maxDiscountAmount);
    }
    calculatedDiscount = Math.round(rawDiscount);
  } else if (coupon.discountType === 'fixed') {
    calculatedDiscount = Math.min(orderAmount, Math.round(coupon.discountValue));
  }

  // Ensure discount does not exceed total order amount
  calculatedDiscount = Math.min(orderAmount, Math.max(0, calculatedDiscount));
  const finalPrice = Math.max(0, orderAmount - calculatedDiscount);

  return {
    valid: true,
    coupon,
    discountAmount: calculatedDiscount,
    finalPrice
  };
};

/**
 * Record usage of a coupon upon successful order placement
 */
export const recordCouponUsage = async (params: {
  couponId: string;
  orderId: string;
  userId: string;
  userEmail?: string;
  discountApplied: number;
}): Promise<void> => {
  try {
    const coupons = await getStoredCoupons();
    const coupon = coupons.find(c => c.id === params.couponId);
    if (!coupon) return;

    coupon.usesCount = (coupon.usesCount || 0) + 1;
    if (!coupon.usedBy) coupon.usedBy = [];

    const record: CouponUsageRecord = {
      orderId: params.orderId,
      userId: params.userId,
      userEmail: params.userEmail,
      discountApplied: params.discountApplied,
      usedAt: new Date().toISOString()
    };

    coupon.usedBy.push(record);
    coupon.updatedAt = new Date().toISOString();

    await saveStoredCoupons(coupons);
  } catch (err) {
    console.error('Error recording coupon usage', err);
  }
};

/**
 * Rollback coupon usage if order is rejected or cancelled
 */
export const rollbackCouponUsage = async (params: {
  couponCode?: string;
  orderId: string;
}): Promise<void> => {
  try {
    const coupons = await getStoredCoupons();
    let modified = false;

    for (const coupon of coupons) {
      if (params.couponCode && coupon.code.toUpperCase() !== params.couponCode.toUpperCase()) {
        continue;
      }

      if (coupon.usedBy && Array.isArray(coupon.usedBy)) {
        const initialLen = coupon.usedBy.length;
        coupon.usedBy = coupon.usedBy.filter(r => r.orderId !== params.orderId);
        if (coupon.usedBy.length < initialLen) {
          coupon.usesCount = Math.max(0, (coupon.usesCount || 1) - (initialLen - coupon.usedBy.length));
          coupon.updatedAt = new Date().toISOString();
          modified = true;
        }
      }
    }

    if (modified) {
      await saveStoredCoupons(coupons);
    }
  } catch (err) {
    console.error('Error rolling back coupon usage', err);
  }
};
