export type ViewMode = 'public' | 'dashboard' | 'admin' | 'categoryPlans' | 'checkout';

export interface HostingService {
  id: string;
  title: string;
  category: 'minecraft' | 'vps' | 'bot' | 'dedicated' | 'web' | 'game';
  icon: string;
  description: string;
  features: string[];
  startingRam?: string;
  startingCpu?: string;
  popular?: boolean;
}

export interface HostingPlan {
  id: string;
  name: string;
  category: 'minecraft' | 'vps' | 'bot' | 'dedicated' | 'game';
  cpu: string;
  ram: string;
  storage: string;
  network: string;
  ddos: string;
  backup: string;
  locations: string[];
  os: string[];
  popular?: boolean;
}

export interface UserServer {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'installing' | 'suspended';
  ip: string;
  port: number;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  location: string;
  node: string;
  uptime: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  relatedPlan?: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdated: string;
  messages: {
    sender: 'user' | 'support';
    name: string;
    text: string;
    time: string;
  }[];
}

export interface PlanRequest {
  id: string;
  planName: string;
  userName: string;
  userEmail: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface SystemNode {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'degraded' | 'maintenance';
  cpuLoad: number;
  ramLoad: number;
  ping: number;
}

export interface DashboardWidget {
  id: string;
  title: string;
  icon: string;
  color: string;
  layoutSize: 'half' | 'full' | 'third';
  visible: boolean;
  section: string;
}

export interface PanelMenuItem {
  id: string;
  label: string;
  icon: string;
  category: string;
  relatedPlan?: string;
  enabled: boolean;
  roles: ('Admin' | 'Staff' | 'User')[];
  order: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  visible: boolean;
}

export interface PageSection {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  buttonText: string;
  imageUrl: string;
  visible: boolean;
}

export interface PageContent {
  id: string;
  name: string;
  path: string;
  sections: PageSection[];
}

export interface ThemeSettings {
  logoText: string;
  primaryColor: string;
  accentColor: string;
  fontStyle: string;
  darkMode: boolean;
  customCss: string;
  animationSpeed: string;
}


export interface AdminPlan {
  id: string;
  name: string;
  category: string;
  relatedPlan?: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  price: number;
  status: 'active' | 'hidden';
  order: number;
}

export interface AdminService {
  id: string;
  serviceName: string;
  userName: string;
  category: string;
  relatedPlan?: string;
  ip: string;
  status: 'active' | 'suspended' | 'terminated';
  renewalDate: string;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'info' | 'warning' | 'urgent';
  active: boolean;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  usesCount: number;
  active: boolean;
}

export interface PaymentGateway {
  id: string;
  name: string;
  enabled: boolean;
  fee: string;
  icon: string;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

export interface FileManagerItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
  url: string;
}

export interface AdminRole {
  id: string;
  name: string;
  color: string;
  icon: string;
  permissions: {
    categories: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };
    plans: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };
    tickets: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };
    users: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };
    roles: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };
    staff: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };
    settings: { view: boolean; create: boolean; edit: boolean; delete: boolean; manage: boolean };
  };
}

export interface AdminCategory {
  id: string;
  name: string;
  slug?: string;
  description: string;
  longDescription?: string;
  logo?: string;
  bannerImage?: string;
  icon: string;
  order: number;
  status: 'active' | 'disabled';
  featured?: boolean;
  buttonText?: string;
  buttonLink?: string;
  badge?: 'New' | 'Popular' | 'Premium' | 'Recommended' | '';
  colorTheme?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoKeywords?: string;
  seoOgImage?: string;
  features?: string[];
}

export interface AdminFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
  order: number;
  status: 'active' | 'disabled';
  badge?: string;
  customImage?: string;
  animationEffect?: string;
  colorTheme?: string;
}

export interface AdminHostingPlan {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  fullDescription?: string;
  logo?: string;
  bannerImage?: string;
  footerImage?: string;
  footerText?: string;
  badge?: 'New' | 'Popular' | 'Premium' | 'Recommended' | '';
  buttonText?: string;
  buttonLink?: string;
  featured?: boolean;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  network?: string;
  ddos?: string;
  backup?: string;
  os?: string[];
  locations?: string[];
  features: string[];
  customSpecs?: { label: string; value: string }[];
  seoTitle?: string;
  seoDescription?: string;
  price: number;
  status: 'active' | 'hidden' | 'draft';
  order: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: 'Admin' | 'Staff' | 'Support' | 'User';
  roles: string[];
  status: 'active' | 'suspended' | 'banned';
  joinedDate: string;
  serversCount: number;
  password?: string;
}

export interface AdminTicketMessage {
  id: string;
  sender: 'user' | 'support';
  name: string;
  text: string;
  time: string;
}

export interface AdminSupportTicket {
  id: string;
  subject: string;
  category: string;
  relatedPlan?: string;
  status: 'open' | 'pending' | 'closed' | 'in_progress';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  lastUpdated: string;
  messages: AdminTicketMessage[];
}


export interface AdminStaff {
  id: string;
  name: string;
  username: string;
  role: 'Owner' | 'Co-Owner' | 'Administrator' | 'Developer' | 'Support' | 'Moderator' | 'Manager' | 'Custom Role';
  customRoleName?: string;
  shortBio: string;
  fullDescription: string;
  profileImage: string;
  backgroundImage?: string;
  discordUsername: string;
  discordUserId?: string;
  discordProfileLink?: string;
  email?: string;
  badgeColor: string;
  socialLinks: {
    discord?: string;
    github?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  order: number;
  featured: boolean;
  status: 'active' | 'hidden';
  dateAdded?: string;
}
export interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  categoryId: string;
  categoryName: string;
  price: number;
  screenshotUrl: string;
  transactionId?: string;
  status: 'pending_verification' | 'approved' | 'rejected';
  rejectionReason?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}
