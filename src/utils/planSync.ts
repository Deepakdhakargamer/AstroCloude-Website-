import { AdminHostingPlan } from '../types';

const PLANS_STORAGE_KEY = 'astro_hosting_plans';

export const INITIAL_PLANS: AdminHostingPlan[] = [
  {
    id: 'plan-vps-1',
    name: 'VPS Cloud Starter',
    categoryId: 'cat-2',
    description: 'High performance KVM cloud VPS with lightning fast NVMe SSD storage.',
    fullDescription: '2 vCPU Ryzen/EPYC cores, 4GB DDR5 RAM, 80GB NVMe SSD, Unmetered Bandwidth, Tbps DDoS Defense.',
    price: 499,
    currency: 'INR',
    billingCycle: 'mo',
    badge: 'Popular',
    featured: true,
    cpu: '2 vCPU EPYC / Ryzen',
    ram: '4 GB DDR5',
    storage: '80 GB NVMe SSD',
    bandwidth: '2 TB @ 1 Gbps',
    network: '1 Gbps Dedicated',
    ddos: 'Path.net 12Tbps Protection',
    locations: ['Mumbai, India', 'Singapore', 'Frankfurt', 'New York'],
    os: ['Ubuntu 24.04', 'Debian 12', 'AlmaLinux 9', 'Windows Server'],
    features: ['Root Access', 'Instant Setup', 'Dedicated IPv4', 'Automated Daily Backups'],
    status: 'active',
    order: 1
  },
  {
    id: 'plan-vps-2',
    name: 'VPS Cloud Pro',
    categoryId: 'cat-2',
    description: 'Scalable cloud computing for demanding web applications and game servers.',
    fullDescription: '4 vCPU cores, 8GB DDR5 RAM, 160GB NVMe SSD, dedicated IPv4 & IPv6, priority routing.',
    price: 999,
    currency: 'INR',
    billingCycle: 'mo',
    badge: 'Recommended',
    featured: true,
    cpu: '4 vCPU EPYC / Ryzen',
    ram: '8 GB DDR5',
    storage: '160 GB NVMe SSD',
    bandwidth: '5 TB @ 1 Gbps',
    network: '1 Gbps Dedicated',
    ddos: 'Path.net 12Tbps Protection',
    locations: ['Mumbai, India', 'Singapore', 'Frankfurt'],
    os: ['Ubuntu 24.04', 'Debian 12', 'Windows Server 2022'],
    features: ['Root Access', 'Instant Setup', 'Dedicated IPv4', 'Snapshot Support'],
    status: 'active',
    order: 2
  },
  {
    id: 'plan-vps-3',
    name: 'VPS Cloud Ultra',
    categoryId: 'cat-2',
    description: 'Maximum performance cloud instance with dedicated hardware priority.',
    fullDescription: '8 vCPU cores, 16GB DDR5 RAM, 320GB NVMe SSD, 10Gbps burstable network.',
    price: 1899,
    currency: 'INR',
    billingCycle: 'mo',
    badge: 'Premium',
    featured: false,
    cpu: '8 vCPU EPYC / Ryzen',
    ram: '16 GB DDR5',
    storage: '320 GB NVMe SSD',
    bandwidth: '10 TB @ 1 Gbps',
    network: '1 Gbps Dedicated',
    ddos: 'Path.net 12Tbps Protection',
    locations: ['Mumbai, India', 'Singapore'],
    os: ['Ubuntu 24.04', 'Debian 12', 'Windows Server 2022'],
    features: ['Root Access', 'Instant Provisioning', 'Dedicated IPv4', 'VIP Support'],
    status: 'active',
    order: 3
  },
  {
    id: 'plan-mc-1',
    name: 'Creeper Node (4GB)',
    categoryId: 'cat-1',
    description: 'Blazing fast Minecraft server hosting on AMD Ryzen 9 7950X.',
    fullDescription: '4GB DDR5 RAM, Ryzen 9 7950X, 50GB NVMe, unlimited player slots, instant modpack installer.',
    price: 299,
    currency: 'INR',
    billingCycle: 'mo',
    badge: 'Popular',
    featured: true,
    cpu: '2 vCPU Ryzen 9 7950X (5.7GHz)',
    ram: '4 GB DDR5 5600MHz',
    storage: '50 GB Gen4 NVMe',
    bandwidth: 'Unmetered',
    network: '1 Gbps Uplink',
    ddos: 'Cosmic Guard Game DDoS',
    locations: ['Mumbai, India', 'Singapore', 'Frankfurt'],
    os: ['PaperMC', 'Purpur', 'Fabric', 'Forge', 'Spigot', 'BungeeCord'],
    features: ['Subdomain Included', 'Modpack 1-Click Installer', 'Automated Backups', 'Full SFTP Access'],
    status: 'active',
    order: 1
  },
  {
    id: 'plan-mc-2',
    name: 'Enderman Node (8GB)',
    categoryId: 'cat-1',
    description: 'For large community SMPs, network hubs, and heavy modpacks.',
    fullDescription: '8GB DDR5 RAM, Ryzen 9 7950X, 100GB NVMe, high tick-rate performance.',
    price: 599,
    currency: 'INR',
    billingCycle: 'mo',
    badge: 'Recommended',
    featured: true,
    cpu: '4 vCPU Ryzen 9 7950X (5.7GHz)',
    ram: '8 GB DDR5 5600MHz',
    storage: '100 GB Gen4 NVMe',
    bandwidth: 'Unmetered',
    network: '1 Gbps Uplink',
    ddos: 'Cosmic Guard Game DDoS',
    locations: ['Mumbai, India', 'Singapore'],
    os: ['PaperMC', 'Purpur', 'Fabric', 'Forge', 'Spigot'],
    features: ['Subdomain Included', 'MySQL Database Free', 'Automated Backups', 'BungeeCord Ready'],
    status: 'active',
    order: 2
  },
  {
    id: 'plan-bot-1',
    name: 'Bot Nano',
    categoryId: 'cat-3',
    description: '24/7 low-latency container hosting for Python, NodeJS, and Go Discord bots.',
    fullDescription: '1GB RAM, 1 vCPU, 10GB NVMe SSD, auto-restart on crash, web console.',
    price: 99,
    currency: 'INR',
    billingCycle: 'mo',
    badge: 'New',
    featured: false,
    cpu: '1 vCPU 3.8GHz',
    ram: '1 GB RAM',
    storage: '10 GB NVMe',
    bandwidth: '500 GB',
    network: 'Shared 1 Gbps',
    ddos: 'Layer 7 Bot Protection',
    locations: ['Mumbai, India', 'Singapore'],
    os: ['NodeJS 20/22', 'Python 3.11/3.12', 'Go 1.22', 'Java 21'],
    features: ['Always Online 24/7', 'GitHub Auto-Deploy', 'Live Logs Console', 'Discord Webhook Alerts'],
    status: 'active',
    order: 1
  },
  {
    id: 'plan-dedi-1',
    name: 'EPYC Bare Metal',
    categoryId: 'cat-4',
    description: 'Enterprise dedicated server hardware with zero virtualization overhead.',
    fullDescription: 'AMD EPYC 7763, 64 Cores / 128 Threads, 128GB ECC RAM, 2x 1.92TB Enterprise NVMe.',
    price: 4999,
    currency: 'INR',
    billingCycle: 'mo',
    badge: 'Premium',
    featured: true,
    cpu: 'AMD EPYC 7763 64C/128T',
    ram: '128 GB ECC DDR4',
    storage: '2x 1.92 TB NVMe RAID',
    bandwidth: '50 TB @ 10 Gbps',
    network: '10 Gbps Burstable',
    ddos: 'Corero Tbps Scrubbing',
    locations: ['Mumbai, India', 'Frankfurt'],
    os: ['Proxmox VE', 'Ubuntu Server', 'Debian', 'Windows Server DC'],
    features: ['IPMI / KVM-over-IP', 'Custom ISO Mount', 'BGP Session Available', 'SLA 99.99%'],
    status: 'active',
    order: 1
  }
];

export const getStoredPlans = (): AdminHostingPlan[] => {
  try {
    const stored = localStorage.getItem(PLANS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p: AdminHostingPlan) => ({
          ...p,
          currency: 'INR'
        }));
      }
    }
  } catch (error) {
    console.error('Failed to parse plans from local storage', error);
  }
  
  // Initialize with default INR plans if none stored yet
  try {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(INITIAL_PLANS));
  } catch (e) {
    console.error('Failed to seed initial plans', e);
  }
  return INITIAL_PLANS;
};

export const updateStoredPlans = (plans: AdminHostingPlan[]) => {
  try {
    const inrPlans = plans.map(p => ({
      ...p,
      currency: 'INR'
    }));
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(inrPlans));
    window.dispatchEvent(new CustomEvent('astro_plans_changed', { detail: inrPlans }));
  } catch (error) {
    console.error('Failed to save plans to local storage', error);
  }
};

