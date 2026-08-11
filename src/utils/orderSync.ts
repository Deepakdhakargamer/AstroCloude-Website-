import { AdminOrder } from '../types';
import { get, set } from 'idb-keyval';

const STORAGE_KEY = 'astro_orders';

export const getStoredOrders = async (): Promise<AdminOrder[]> => {
  try {
    const data = await get(STORAGE_KEY);
    return data || [];
  } catch (err) {
    console.error('Error reading orders from IndexedDB', err);
    return [];
  }
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
  await saveStoredOrders(orders);
};

export const addOrder = async (order: AdminOrder) => {
  const orders = await getStoredOrders();
  await saveStoredOrders([order, ...orders]);
};

export const updateOrder = async (orderId: string, updates: Partial<AdminOrder>) => {
  const orders = await getStoredOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o);
  await saveStoredOrders(updated);
};
