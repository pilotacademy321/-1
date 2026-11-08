/**
 * Authorization & Access Control Logic
 * DNA Laboratory Architecture
 */

import { User, UserRole, PermissionAction } from '../types/auth';
import { hasPermission, canAccessPatientData } from '../config/permissions';

export interface AuthorizationResult {
  authorized: boolean;
  reason?: string;
}

/**
 * Validates access to perform an action based on authenticated user state.
 * Enforces staff approval state and role checks.
 */
export function authorizeAction(
  user: User | null,
  action: PermissionAction,
  targetPatientUserId?: string
): AuthorizationResult {
  if (!user) {
    return { authorized: false, reason: 'AUTH_REQUIRED' };
  }

  // 1. Staff approval verification: pending or rejected staff cannot perform staff actions
  if (user.role === 'staff') {
    if (user.staffStatus !== 'approved') {
      return {
        authorized: false,
        reason: `STAFF_${(user.staffStatus || 'PENDING').toUpperCase()}`,
      };
    }
  }

  // 2. Check general RBAC action permission
  if (!hasPermission(user.role, action)) {
    return {
      authorized: false,
      reason: `ROLE_ACTION_UNAUTHORIZED: ${user.role} cannot perform ${action}`,
    };
  }

  // 3. Check patient clinical isolation if target patient is specified
  if (targetPatientUserId) {
    const isAllowed = canAccessPatientData(user.role, user.id, targetPatientUserId);
    if (!isAllowed) {
      return {
        authorized: false,
        reason: 'PATIENT_DATA_ISOLATION_VIOLATION',
      };
    }
  }

  return { authorized: true };
}

/**
 * Server-Side Claim Verification Contract:
 * Simulates server-side JWT or custom claim validation to prevent client-side role manipulation.
 */
export function verifyServerClaims(
  tokenClaims: { uid: string; role?: string; staffStatus?: string },
  clientClaimedRole: UserRole
): boolean {
  if (!tokenClaims.role) return false;
  return tokenClaims.role === clientClaimedRole;
}
