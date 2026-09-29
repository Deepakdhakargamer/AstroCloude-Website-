import { AdminStaff } from '../types';

const STORAGE_KEY = 'astro_admin_staff';

export const INITIAL_STAFF: AdminStaff[] = [
  {
    id: 'staff-1',
    name: 'Alex Turner',
    username: 'alexturner',
    role: 'Owner',
    shortBio: 'Founder & CEO of AstroCloude. Passionate about high-performance hosting.',
    fullDescription: 'Started AstroCloude with a vision to provide the best hosting services globally. I oversee all operations and ensure we deliver top-tier performance to our clients.',
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80',
    discordUsername: 'alexturner#0001',
    badgeColor: '#a855f7',
    socialLinks: {
      twitter: 'https://twitter.com/alexturner',
      github: 'https://github.com/alexturner',
    },
    order: 1,
    featured: true,
    status: 'active',
    dateAdded: '2023-10-15'
  },
  {
    id: 'staff-2',
    name: 'Sarah Connor',
    username: 'sarahc',
    role: 'Developer',
    shortBio: 'Lead Full-Stack Developer at AstroCloude.',
    fullDescription: 'I build and maintain the core infrastructure and control panel for AstroCloude. My focus is on writing clean, scalable, and secure code.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    discordUsername: 'sarahc#1234',
    badgeColor: '#3b82f6',
    socialLinks: {
      github: 'https://github.com/sarahc',
    },
    order: 2,
    featured: true,
    status: 'active',
    dateAdded: '2024-01-22'
  }
];

export function getStoredStaff(): AdminStaff[] {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn('Error reading staff from localStorage', e);
  }
  return INITIAL_STAFF;
}

export function saveStoredStaff(staff: AdminStaff[]): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
    window.dispatchEvent(new CustomEvent('astro_staff_changed', { detail: staff }));
  } catch (e) {
    console.warn('Error saving staff to localStorage', e);
  }
}
