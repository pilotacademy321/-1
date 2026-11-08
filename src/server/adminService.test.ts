/**
 * DNA Laboratory - Server-Side Administrative & Security Service Tests
 * Phase 03: Super Admin & Laboratory Owner Management System
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from './db';
import { adminService } from './adminService';
import { authService } from './authService';

test('SETUP: Reset database for Phase 03 tests', async () => {
  await db.resetForTesting();
  const stats = await db.getSystemStatistics();
  assert.equal(stats.totalUsers, 3); // Seeded: 1 owner, 1 admin, 1 staff
});

test('TEST 1: Normal patient attempts to open Super Admin dashboard -> Access denied', async () => {
  // Register a real patient
  const patientSession = await authService.registerPatient(
    { googleUid: 'google_patient_test_01', email: 'patient.test@gmail.com', name: 'أحمد محمود' },
    { fullName: 'أحمد محمود', phone: '+966551122334', city: 'الرياض' }
  );

  // Patient attempts to call Super Admin getSystemOverview
  await assert.rejects(
    async () => {
      await adminService.getSystemOverview(patientSession.user.id);
    },
    (err: Error) => {
      assert.match(err.message, /ACCESS_DENIED/);
      return true;
    }
  );
});

test('TEST 2: Normal staff member attempts to open Laboratory Owner dashboard -> Access denied', async () => {
  const staffUser = await db.getUserByEmail('specialist@dnalab.internal');
  assert.ok(staffUser);

  // Staff attempts to call Laboratory Owner getLaboratoryOwnerOverview
  await assert.rejects(
    async () => {
      await adminService.getLaboratoryOwnerOverview(staffUser.id);
    },
    (err: Error) => {
      assert.match(err.message, /ACCESS_DENIED/);
      return true;
    }
  );
});

test('TEST 3: Super Admin accesses technical administration -> Authorized after server-side identity verification', async () => {
  const adminUser = await db.getUserByEmail('admin@dnalab.internal');
  assert.ok(adminUser);
  assert.equal(adminUser.role, 'super_admin');

  const overview = await adminService.getSystemOverview(adminUser.id);
  assert.ok(overview.statistics);
  assert.equal(overview.statistics.systemHealth, 'healthy');
  assert.equal(overview.statistics.databaseConnectionStatus, 'connected');
  assert.ok(overview.recentAuditLogs.length > 0);
});

test('TEST 4: Super Admin attempts to assign themselves Laboratory Owner -> Rejected', async () => {
  const adminUser = (await db.getUserByEmail('admin@dnalab.internal'))!;
  
  await assert.rejects(
    async () => {
      await adminService.assignLaboratoryOwner(adminUser.id, adminUser.id);
    },
    (err: Error) => {
      assert.match(err.message, /SECURITY_VIOLATION/);
      return true;
    }
  );
});

test('TEST 5: Laboratory Owner accesses laboratory administration -> Authorized', async () => {
  const ownerUser = await db.getUserByEmail('owner@dnalab.internal');
  assert.ok(ownerUser);
  assert.equal(ownerUser.role, 'lab_owner');

  const overview = await adminService.getLaboratoryOwnerOverview(ownerUser.id);
  assert.ok(overview);
  assert.equal(overview.owner.id, ownerUser.id);
  assert.ok(overview.certifiedStaffCount >= 1);
});

test('TEST 6: Patient attempts to modify their role -> Rejected', async () => {
  const patient = (await db.getUserByEmail('patient.test@gmail.com'))!;
  
  // Direct attempt to update role via authService/db without server authorization
  await assert.rejects(
    async () => {
      await authService.registerPatient(
        { googleUid: 'google_hacker', email: 'hacker@test.com', name: 'Hacker' },
        { fullName: 'Hacker', phone: '+966500000000', city: 'الرياض', role: 'lab_owner' as any }
      );
    },
    (err: Error) => {
      assert.match(err.message, /SECURITY_VIOLATION/);
      return true;
    }
  );
});

test('TEST 7: Staff attempts to approve their own application -> Rejected', async () => {
  // Register a new staff applicant
  const staffSession = await authService.registerStaff(
    { googleUid: 'google_staff_self_approve', email: 'staff.self@dnalab.internal', name: 'فني مخبري' },
    { fullName: 'فني مخبري', phone: '+966512345678', city: 'الرياض', jobTitle: 'فني سحب عينات' }
  );

  const application = await db.getStaffApplicationByUserId(staffSession.user.id);
  assert.ok(application);

  // Staff member attempts to approve their own application
  await assert.rejects(
    async () => {
      await adminService.approveStaff(staffSession.user.id, application.id);
    },
    (err: Error) => {
      assert.match(err.message, /ACCESS_DENIED/);
      return true;
    }
  );
});

test('TEST 8: Unauthorized user or admin attempts to delete audit records -> Rejected (Immutable)', async () => {
  const adminUser = (await db.getUserByEmail('admin@dnalab.internal'))!;
  const logs = await adminService.getAuditLogs(adminUser.id);
  assert.ok(logs.length > 0);

  // Even the Super Admin CANNOT delete audit records
  await assert.rejects(
    async () => {
      await adminService.deleteAuditLogEntry(adminUser.id, logs[0].id);
    },
    (err: Error) => {
      assert.match(err.message, /SECURITY_VIOLATION/);
      return true;
    }
  );
});

test('TEST 9: Suspended user attempts to access a protected dashboard -> Access denied', async () => {
  const adminUser = (await db.getUserByEmail('admin@dnalab.internal'))!;
  const patient = (await db.getUserByEmail('patient.test@gmail.com'))!;

  // Super Admin suspends the user
  const suspended = await adminService.suspendUserAccount(adminUser.id, patient.id, 'Violation of terms');
  assert.equal(suspended.account_status, 'suspended');

  // Verify that the suspended user is blocked from operations
  await assert.rejects(
    async () => {
      await adminService.getSystemOverview(patient.id);
    },
    (err: Error) => {
      assert.match(err.message, /ACCOUNT_SUSPENDED/);
      return true;
    }
  );

  // Reactivate user and verify restoration
  const reactivated = await adminService.reactivateUserAccount(adminUser.id, patient.id);
  assert.equal(reactivated.account_status, 'active');
});

test('TEST 10: Super Admin is strictly isolated from patient clinical medical records (HIPAA Separation)', async () => {
  const adminUser = (await db.getUserByEmail('admin@dnalab.internal'))!;
  
  await assert.rejects(
    async () => {
      await adminService.accessPatientMedicalRecord(adminUser.id, 'med_rec_001');
    },
    (err: Error) => {
      assert.match(err.message, /PRIVACY_VIOLATION/);
      return true;
    }
  );
});

test('TEST 11: Real database statistics calculation -> Exact values without inventing numbers', async () => {
  const adminUser = (await db.getUserByEmail('admin@dnalab.internal'))!;
  const overview = await adminService.getSystemOverview(adminUser.id);
  const stats = overview.statistics;

  const allUsers = await db.getAllUsers();
  assert.equal(stats.totalUsers, allUsers.length);
  assert.equal(stats.totalPatients, allUsers.filter(u => u.role === 'patient').length);
  assert.equal(stats.totalStaff, allUsers.filter(u => u.role === 'staff').length);
  assert.equal(stats.activeAccounts, allUsers.filter(u => u.account_status === 'active').length);
  assert.equal(stats.suspendedAccounts, allUsers.filter(u => u.account_status === 'suspended').length);
});

test('TEST 12: Laboratory Owner approves pending staff -> Status becomes approved and account becomes active', async () => {
  const ownerUser = (await db.getUserByEmail('owner@dnalab.internal'))!;
  const staffUser = (await db.getUserByEmail('staff.self@dnalab.internal'))!;
  const app = (await db.getStaffApplicationByUserId(staffUser.id))!;

  assert.equal(app.application_status, 'pending');
  const result = await adminService.approveStaff(ownerUser.id, app.id);
  assert.equal(result.application.application_status, 'approved');

  const updatedUser = (await db.getUserById(staffUser.id))!;
  assert.equal(updatedUser.account_status, 'active');
});
