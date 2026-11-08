import test from 'node:test';
import assert from 'node:assert/strict';
import { authService, VerifiedGoogleIdentity } from './authService';
import { db } from './db';
import { canAccessPatientData } from '../config/permissions';
import { authorizeAction } from '../utils/authorization';

test('SETUP: Reset database state for testing', async () => {
  await db.resetForTesting();
});

test('TEST 1: New Google user registers as Patient -> Account becomes ACTIVE', async () => {
  const googleIdentity: VerifiedGoogleIdentity = {
    googleUid: 'goog_patient_001',
    email: 'newpatient@example.com',
    name: 'سارة خالد',
    photoUrl: 'https://example.com/avatar.jpg',
  };

  // Step 1: Process Google identity -> should detect isNewUser = true
  const initialCheck = await authService.processGoogleIdentity(googleIdentity);
  assert.equal(initialCheck.isNewUser, true);

  // Step 2: Register as Patient
  const result = await authService.registerPatient(googleIdentity, {
    fullName: 'سارة خالد',
    phone: '+966551234567',
    city: 'الرياض',
    gender: 'female',
    dateOfBirth: '1995-04-12',
  });

  assert.equal(result.user.role, 'patient');
  assert.equal(result.user.account_status, 'active');
  assert.equal(result.redirectRoute, 'patient:profile');
  assert.ok(result.sessionToken.startsWith('dna_sess_'));
  assert.equal(result.patientProfile?.city, 'الرياض');

  // Verify stored in DB
  const storedUser = await db.getUserById(result.user.id);
  assert.equal(storedUser?.role, 'patient');
  assert.equal(storedUser?.account_status, 'active');
});

test('TEST 2: New Google user registers as Staff -> Staff application becomes PENDING', async () => {
  const staffGoogleIdentity: VerifiedGoogleIdentity = {
    googleUid: 'goog_staff_applicant_001',
    email: 'applicant.tech@example.com',
    name: 'خالد الحربي',
  };

  const initialCheck = await authService.processGoogleIdentity(staffGoogleIdentity);
  assert.equal(initialCheck.isNewUser, true);

  const result = await authService.registerStaff(staffGoogleIdentity, {
    fullName: 'خالد الحربي',
    phone: '+966559876543',
    city: 'جدة',
    jobTitle: 'فني سحب وتحضير عينات مخبرية',
    additionalInfo: 'خبرة سنتين في التحاليل الجينية',
  });

  assert.equal(result.user.role, 'staff');
  assert.equal(result.user.account_status, 'pending');
  assert.equal(result.redirectRoute, 'staff:pending');
  assert.equal(result.staffApplication?.application_status, 'pending');
  assert.equal(result.staffApplication?.job_title, 'فني سحب وتحضير عينات مخبرية');

  // Verify stored in DB
  const storedApp = await db.getStaffApplicationByUserId(result.user.id);
  assert.equal(storedApp?.application_status, 'pending');
});

test('TEST 3: Pending staff attempts to access staff protected actions -> Access denied', async () => {
  const staffUser = await db.getUserByEmail('applicant.tech@example.com');
  assert.ok(staffUser);
  assert.equal(staffUser.account_status, 'pending');

  // Check with authorization guard
  const userObj = {
    id: staffUser.id,
    email: staffUser.email,
    displayName: staffUser.full_name,
    role: staffUser.role,
    staffStatus: 'pending' as const,
    createdAt: staffUser.created_at,
    updatedAt: staffUser.updated_at,
    emailVerified: true,
  };

  const sampleAccess = authorizeAction(userObj, 'samples:manage');
  assert.equal(sampleAccess.authorized, false);
  assert.equal(sampleAccess.reason, 'STAFF_PENDING');

  const resultEntry = authorizeAction(userObj, 'results:enter');
  assert.equal(resultEntry.authorized, false);
  assert.equal(resultEntry.reason, 'STAFF_PENDING');
});

test('TEST 4: Patient attempts to access another patient medical records -> Access denied', async () => {
  const isAllowed = canAccessPatientData('patient', 'usr_patient_A', 'usr_patient_B');
  assert.equal(isAllowed, false);

  const ownAccessAllowed = canAccessPatientData('patient', 'usr_patient_A', 'usr_patient_A');
  assert.equal(ownAccessAllowed, true);
});

test('TEST 5: Unauthenticated visitor attempts to access protected dashboard -> Denied', () => {
  const unauthCheck = authorizeAction(null, 'appointments:manage_all');
  assert.equal(unauthCheck.authorized, false);
  assert.equal(unauthCheck.reason, 'AUTH_REQUIRED');
});

test('TEST 6: Client attempts to assign themselves Laboratory Owner -> Server rejects', async () => {
  const hackerGoogleIdentity: VerifiedGoogleIdentity = {
    googleUid: 'goog_hacker_001',
    email: 'hacker@example.com',
    name: 'Bad Actor',
  };

  // Attempting to inject role: 'lab_owner' into patient registration
  await assert.rejects(
    async () => {
      await authService.registerPatient(hackerGoogleIdentity, {
        fullName: 'Bad Actor',
        phone: '+966500000000',
        city: 'الرياض',
        role: 'lab_owner', // Unauthorized
      });
    },
    /SECURITY_VIOLATION/
  );
});

test('TEST 7: Client attempts to assign themselves Super Admin -> Server rejects', async () => {
  const hackerGoogleIdentity: VerifiedGoogleIdentity = {
    googleUid: 'goog_hacker_002',
    email: 'hacker2@example.com',
    name: 'Bad Actor 2',
  };

  // Attempting to inject role: 'super_admin' into staff registration
  await assert.rejects(
    async () => {
      await authService.registerStaff(hackerGoogleIdentity, {
        fullName: 'Bad Actor 2',
        phone: '+966500000000',
        city: 'الرياض',
        jobTitle: 'Hacker',
        role: 'super_admin', // Unauthorized
      });
    },
    /SECURITY_VIOLATION/
  );
});

test('TEST 8: Existing patient signs in again -> Retrieved without duplicate registration', async () => {
  const existingPatientGoogleIdentity: VerifiedGoogleIdentity = {
    googleUid: 'goog_patient_001', // Already registered in TEST 1
    email: 'newpatient@example.com',
    name: 'سارة خالد',
  };

  const loginResult = await authService.processGoogleIdentity(existingPatientGoogleIdentity);
  assert.equal(loginResult.isNewUser, false);
  assert.ok(loginResult.session);
  assert.equal(loginResult.session.user.role, 'patient');
  assert.equal(loginResult.session.user.account_status, 'active');
  assert.equal(loginResult.session.redirectRoute, 'patient:profile');
  assert.equal(loginResult.session.patientProfile?.city, 'الرياض');
});

test('TEST 9: Laboratory Owner approves staff application -> Account becomes ACTIVE', async () => {
  // 1. Get the applicant
  const applicant = await db.getUserByEmail('applicant.tech@example.com');
  assert.ok(applicant);
  const application = await db.getStaffApplicationByUserId(applicant.id);
  assert.ok(application);
  assert.equal(application.application_status, 'pending');

  // 2. Owner approves
  const owner = await db.getUserByEmail('owner@dnalab.internal');
  assert.ok(owner);

  const approvalResult = await authService.approveStaffApplication(owner.id, application.id);
  assert.equal(approvalResult.success, true);
  assert.equal(approvalResult.application.application_status, 'approved');
  assert.equal(approvalResult.application.reviewed_by, owner.id);

  // 3. Verify user account status is now active
  const updatedUser = await db.getUserById(applicant.id);
  assert.equal(updatedUser?.account_status, 'active');

  // 4. Returning staff login now directs to staff dashboard
  const returningStaffLogin = await authService.processGoogleIdentity({
    googleUid: applicant.google_uid,
    email: applicant.email,
    name: applicant.full_name,
  });
  assert.equal(returningStaffLogin.isNewUser, false);
  assert.equal(returningStaffLogin.session?.redirectRoute, 'staff:dashboard');
});

test('TEST 10: Unauthorized user attempts to approve staff application -> Server rejects', async () => {
  const patient = await db.getUserByEmail('newpatient@example.com');
  assert.ok(patient);

  const applications = await db.getAllStaffApplications();
  assert.ok(applications.length > 0);

  // Patient attempting to approve a staff application
  await assert.rejects(
    async () => {
      await authService.approveStaffApplication(patient.id, applications[0].id);
    },
    /ACCESS_DENIED/
  );
});
