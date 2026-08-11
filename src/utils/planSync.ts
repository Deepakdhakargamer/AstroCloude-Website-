import { AdminHostingPlan } from '../types';

const PLANS_STORAGE_KEY = 'astro_hosting_plans';

export const getStoredPlans = (): AdminHostingPlan[] => {
  try {
    const stored = localStorage.getItem(PLANS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to parse plans from local storage', error);
  }
  
  return [];
};

export const updateStoredPlans = (plans: AdminHostingPlan[]) => {
  try {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    window.dispatchEvent(new CustomEvent('astro_plans_changed', { detail: plans }));
  } catch (error) {
    console.error('Failed to save plans to local storage', error);
  }
};
