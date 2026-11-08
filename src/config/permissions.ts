/**
 * Role-Based Access Control (RBAC) & Permission Matrix
 * DNA Laboratory Architecture
 */

import { UserRole, PermissionAction, RolePermissions } from '../types/auth';

export const ROLE_DEFINITIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    descriptionArabic: 'المسؤول التقني للمنظومة — إدارة البنية التحتية، الأمان، وسجلات النظام التقنية',
    descriptionEnglish: 'Technical System Administrator — Platform infrastructure, health monitoring, and security logs',
    allowedActions: [
      'system:manage',
      'system:audit_view',
      'system:settings_edit',
      'audit:export',
    ],
  },
  lab_owner: {
    role: 'lab_owner',
    descriptionArabic: 'مالك المختبر — الإشراف الإداري والطبي الشامل، اعتماد الكادر، التسعير، واعتماد النتائج',
    descriptionEnglish: 'Laboratory Owner — Full administrative & clinical authority, staff approvals, pricing, and final approvals',
    allowedActions: [
      'lab:manage',
      'lab:settings_edit',
      'staff:approve_reject',
      'staff:manage',
      'tests:catalog_edit',
      'tests:catalog_view',
      'appointments:manage_all',
      'samples:manage',
      'results:enter',
      'results:verify',
      'results:approve_final',
      'results:view_all',
      'records:view_all',
      'reports:generate',
      'messages:all_channels',
      'system:audit_view',
    ],
  },
  staff: {
    role: 'staff',
    descriptionArabic: 'الكادر المخبري والطبي — استقبال العينات، إدخال القياسات والتحقق المخبري',
    descriptionEnglish: 'Laboratory Staff — Sample accessioning, result entry, and clinical verification',
    allowedActions: [
      'tests:catalog_view',
      'appointments:view_assigned',
      'samples:manage',
      'results:enter',
      'results:verify',
      'records:view_all',
      'reports:generate',
      'messages:self_conversations',
    ],
  },
  patient: {
    role: 'patient',
    descriptionArabic: 'المراجع / المريض — حجز المواعيد والاطلاع الحصري على السجل الطبي والنتائج الشخصية فقط',
    descriptionEnglish: 'Patient — Appointment booking and strictly isolated access to personal medical files only',
    allowedActions: [
      'tests:catalog_view',
      'appointments:book_self',
      'records:view_self',
      'results:view_self',
      'reports:view_self',
      'messages:self_conversations',
    ],
  },
};

/**
 * Validates whether a given role has the right to perform a specific action.
 */
export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  const permissions = ROLE_DEFINITIONS[role]?.allowedActions;
  if (!permissions) return false;
  return permissions.includes(action);
}

/**
 * Strict Patient Isolation Rule:
 * Ensures patient can never access records belonging to another patient.
 */
export function canAccessPatientData(
  actorRole: UserRole,
  actorUserId: string,
  targetPatientUserId: string
): boolean {
  if (actorRole === 'patient') {
    return actorUserId === targetPatientUserId;
  }
  
  if (actorRole === 'lab_owner' || actorRole === 'staff') {
    return true; // Authorized medical staff can review clinical data
  }
  
  // Super Admin is technical only: CANNOT inspect patient records directly without audited consent
  return false;
}
