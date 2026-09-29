import { AdminSupportTicket } from '../types';

const STORAGE_KEY = 'astro_tickets';

export const INITIAL_TICKETS: AdminSupportTicket[] = [];

export function getStoredTickets(): AdminSupportTicket[] {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn('Error reading tickets from localStorage', e);
  }
  return INITIAL_TICKETS;
}

export function saveStoredTickets(tickets: AdminSupportTicket[]): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    window.dispatchEvent(new CustomEvent('astro_tickets_changed', { detail: tickets }));
  } catch (e) {
    console.warn('Error saving tickets to localStorage', e);
  }
}
