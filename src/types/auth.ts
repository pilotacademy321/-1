/**
 * User Roles and Authentication Types
 * DNA Laboratory - Phase 01 Architecture
 */

export type UserRole = 'super_admin' | 'lab_owner' | 'staff' | 'patient';

export type StaffStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type PatientStatus = 'active' | 'archived';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  phoneNumber?: string;
  
  // Specific role status
  staffStatus?: StaffStatus; // Only for staff
  patientStatus?: PatientStatus; // Only for patients
}

export interface UserProfile {
  userId: string;
  fullNameArabic: string;
  fullNameEnglish: string;
  nationalIdOrIqama?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  specialization?: string; // For staff (e.g. Hematology, Molecular Genetics)
  licenseNumber?: string;  // For staff
}

export type PermissionAction = 
  | 'system:manage'
  | 'system:audit_view'
  | 'system:settings_edit'
  | 'lab:manage'
  | 'lab:settings_edit'
  | 'staff:approve_reject'
  | 'staff:manage'
  | 'tests:catalog_edit'
  | 'tests:catalog_view'
  | 'appointments:manage_all'
  | 'appointments:view_assigned'
  | 'appointments:book_self'
  | 'samples:manage'
  | 'results:enter'
  | 'results:verify'
  | 'results:approve_final'
  | 'results:view_self'
  | 'results:view_all'
  | 'records:view_all'
  | 'records:view_self'
  | 'reports:generate'
  | 'reports:view_self'
  | 'messages:all_channels'
  | 'messages:self_conversations'
  | 'audit:export';

export interface RolePermissions {
  role: UserRole;
  allowedActions: PermissionAction[];
  descriptionArabic: string;
  descriptionEnglish: string;
}

export interface AuthSession {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}
