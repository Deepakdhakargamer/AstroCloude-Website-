import { AdminFeature } from '../types';

const FEATURE_STORAGE_KEY = 'astro_admin_homepage_features_v1';

export const INITIAL_FEATURES: AdminFeature[] = [
  {
    id: 'feat-1',
    title: 'Instant Deployment',
    description: 'Your server is provisioned and ready in under 60 seconds after your plan request is approved.',
    icon: 'Zap',
    iconColor: 'amber',
    order: 1,
    status: 'active',
    badge: 'Fast',
    customImage: '',
    animationEffect: 'fade-up',
    colorTheme: 'slate',
  },
  {
    id: 'feat-2',
    title: 'NVMe Gen4 SSD Storage',
    description: 'Blazing-fast read/write speeds ensuring lightning map loads and zero database bottlenecks.',
    icon: 'HardDrive',
    iconColor: 'blue',
    order: 2,
    status: 'active',
    badge: 'NVMe',
    customImage: '',
    animationEffect: 'fade-up',
    colorTheme: 'slate',
  },
  {
    id: 'feat-3',
    title: 'AMD Ryzen & EPYC CPUs',
    description: 'High-frequency 5.7GHz processors delivering unrivaled single-core performance for game servers.',
    icon: 'Cpu',
    iconColor: 'purple',
    order: 3,
    status: 'active',
    badge: '5.7GHz',
    customImage: '',
    animationEffect: 'fade-up',
    colorTheme: 'slate',
  },
  {
    id: 'feat-4',
    title: 'Enterprise DDoS Defense',
    description: 'Always-on Arbor & Cloudflare Magic Transit protection mitigating attacks up to Tbps automatically.',
    icon: 'ShieldCheck',
    iconColor: 'emerald',
    order: 4,
    status: 'active',
    badge: 'Protected',
    customImage: '',
    animationEffect: 'fade-up',
    colorTheme: 'slate',
  },
  {
    id: 'feat-5',
    title: '99.99% Uptime SLA',
    description: 'Redundant power grids, carrier-neutral BGP networks, and N+1 cooling guarantee continuous uptime.',
    icon: 'Activity',
    iconColor: 'indigo',
    order: 5,
    status: 'active',
    badge: 'SLA',
    customImage: '',
    animationEffect: 'fade-up',
    colorTheme: 'slate',
  },
  {
    id: 'feat-6',
    title: '24/7 Expert Support',
    description: 'Our senior system administrators are always on standby via live ticket chat to assist you.',
    icon: 'Headphones',
    iconColor: 'rose',
    order: 6,
    status: 'active',
    badge: 'Support',
    customImage: '',
    animationEffect: 'fade-up',
    colorTheme: 'slate',
  },
  {
    id: 'feat-7',
    title: 'Global Data Centers',
    description: 'Strategically located nodes in Frankfurt, New York, Singapore, London, and Tokyo for low ping.',
    icon: 'Globe',
    iconColor: 'cyan',
    order: 7,
    status: 'active',
    badge: 'Global',
    customImage: '',
    animationEffect: 'fade-up',
    colorTheme: 'slate',
  },
  {
    id: 'feat-8',
    title: 'Automated Daily Backups',
    description: 'Never lose progress. Automated snapshot backups stored securely in independent offsite vaults.',
    icon: 'Database',
    iconColor: 'violet',
    order: 8,
    status: 'active',
    badge: 'Backup',
    customImage: '',
    animationEffect: 'fade-up',
    colorTheme: 'slate',
  },
];

export function getStoredFeatures(): AdminFeature[] {
  try {
    const item = localStorage.getItem(FEATURE_STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn('Error reading features from localStorage', e);
  }
  return INITIAL_FEATURES;
}

export function saveStoredFeatures(features: AdminFeature[]): void {
  try {
    localStorage.removeItem(FEATURE_STORAGE_KEY);
    localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(features));
    window.dispatchEvent(new CustomEvent('astro_features_changed', { detail: features }));
  } catch (e) {
    console.warn('Error saving features to localStorage', e);
  }
}
