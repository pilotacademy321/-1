import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeAction, verifyServerClaims } from './authorization';
import { canAccessPatientData } from '../config/permissions';
import { User } from '../types/auth';

test('Unauthenticated user is denied', () => {
  const result = authorizeAction(null, 'tests:catalog_view');
  assert.equal(result.authorized, false);
  assert.equal(result.reason, 'AUTH_REQUIRED');
});

test('Super Admin cannot access patient medical records', () => {
  const superAdmin: User = {
    id: 'admin-001',
    email: 'admin@dnalab.internal',
    displayName: 'Systems Administrator',
    role: 'super_admin',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    emailVerified: true,
  };

  // Admin can manage system
  const canManage = authorizeAction(superAdmin, 'system:manage');
  assert.equal(canManage.authorized, true);

  // Admin CANNOT view patient records
  const canViewRecords = authorizeAction(superAdmin, 'records:view_all');
  assert.equal(canViewRecords.authorized, false);

  // canAccessPatientData returns false for Super Admin (strict HIPAA/clinical separation)
  assert.equal(canAccessPatientData('super_admin', 'admin-001', 'patient-999'), false);
});

test('Laboratory Owner has full administrative and result approval access', () => {
  const owner: User = {
    id: 'owner-001',
    email: 'director@dnalab.internal',
    displayName: 'Lab Medical Director',
    role: 'lab_owner',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    emailVerified: true,
  };

  assert.equal(authorizeAction(owner, 'staff:approve_reject').authorized, true);
  assert.equal(authorizeAction(owner, 'tests:catalog_edit').authorized, true);
  assert.equal(authorizeAction(owner, 'results:approve_final').authorized, true);
  assert.equal(canAccessPatientData('lab_owner', 'owner-001', 'patient-999'), true);
});

test('Staff with PENDING status is blocked from all staff actions', () => {
  const pendingStaff: User = {
    id: 'staff-pending-01',
    email: 'tech@dnalab.internal',
    displayName: 'New Lab Tech',
    role: 'staff',
    staffStatus: 'pending',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    emailVerified: true,
  };

  const attemptResult = authorizeAction(pendingStaff, 'samples:manage');
  assert.equal(attemptResult.authorized, false);
  assert.equal(attemptResult.reason, 'STAFF_PENDING');
});

test('Staff with APPROVED status can accession samples and enter results', () => {
  const approvedStaff: User = {
    id: 'staff-approved-01',
    email: 'tech@dnalab.internal',
    displayName: 'Senior Lab Tech',
    role: 'staff',
    staffStatus: 'approved',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    emailVerified: true,
  };

  assert.equal(authorizeAction(approvedStaff, 'samples:manage').authorized, true);
  assert.equal(authorizeAction(approvedStaff, 'results:enter').authorized, true);
  // But staff cannot approve/reject other staff
  assert.equal(authorizeAction(approvedStaff, 'staff:approve_reject').authorized, false);
});

test('Patient isolation: Patient A cannot access Patient B records', () => {
  const patientA: User = {
    id: 'patient-A',
    email: 'patientA@example.com',
    displayName: 'Ahmed Patient',
    role: 'patient',
    patientStatus: 'active',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    emailVerified: true,
  };

  // Access own data -> allowed
  assert.equal(authorizeAction(patientA, 'records:view_self', 'patient-A').authorized, true);

  // Access other patient data -> denied
  const crossPatientAttempt = authorizeAction(patientA, 'records:view_self', 'patient-B');
  assert.equal(crossPatientAttempt.authorized, false);
  assert.equal(crossPatientAttempt.reason, 'PATIENT_DATA_ISOLATION_VIOLATION');
});

test('Client cannot fabricate role without server claim match', () => {
  const serverClaims = { uid: 'usr-123', role: 'patient' };
  assert.equal(verifyServerClaims(serverClaims, 'patient'), true);
  assert.equal(verifyServerClaims(serverClaims, 'super_admin'), false);
  assert.equal(verifyServerClaims(serverClaims, 'lab_owner'), false);
});
