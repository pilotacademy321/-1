import { Language } from './index';
import { UserRole } from './auth';

export interface PortalNavItem {
  id: string;
  route: string;
  icon: string;
  label: Record<Language, string>;
  description?: Record<Language, string>;
  badge?: string;
}

export interface RoleNavigationConfig {
  role: UserRole;
  portalTitle: Record<Language, string>;
  portalBadge: Record<Language, string>;
  navItems: PortalNavItem[];
}

export type AppRoute = 
  // Public
  | 'public:home'
  | 'public:tests'
  | 'public:booking'
  | 'public:about'
  | 'public:contact'
  | 'public:signin'
  
  // Super Admin
  | 'admin:overview'
  | 'admin:users'
  | 'admin:owner_account'
  | 'admin:security'
  | 'admin:audit'
  | 'admin:settings'
  | 'admin:backup'
  | 'admin:notifications'
  | 'admin:health'
  
  // Laboratory Owner
  | 'owner:dashboard'
  | 'owner:appointments'
  | 'owner:patients'
  | 'owner:catalog'
  | 'owner:staff'
  | 'owner:results'
  | 'owner:messages'
  | 'owner:reports'
  | 'owner:financial'
  | 'owner:settings'
  | 'owner:notifications'
  | 'owner:audit'
  
  // Staff
  | 'staff:dashboard'
  | 'staff:appointments'
  | 'staff:patients'
  | 'staff:tests'
  | 'staff:samples'
  | 'staff:results'
  | 'staff:messages'
  
  // Patient
  | 'patient:profile'
  | 'patient:book'
  | 'patient:appointments'
  | 'patient:records'
  | 'patient:results'
  | 'patient:messages'
  | 'patient:settings';
