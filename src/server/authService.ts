/**
 * DNA Laboratory - Server-Side Authentication & Registration Service
 * Phase 02: Google Authentication & Account Registration System
 */

import { 
  db, 
  DbUserRecord, 
  DbPatientProfileRecord, 
  DbStaffApplicationRecord, 
  UserRole, 
  AccountStatus 
} from './db';

function generateRandomHex(byteCount = 16): string {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    const array = new Uint8Array(byteCount);
    globalThis.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface VerifiedGoogleIdentity {
  googleUid: string;
  email: string;
  name: string;
  photoUrl?: string;
}

export interface PatientRegistrationInput {
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  city: string;
  address?: string;
  photoUrl?: string;
  // Security guard: Any attempt by client to pass role is rejected
  role?: string;
}

export interface StaffRegistrationInput {
  fullName: string;
  phone: string;
  city: string;
  address?: string;
  jobTitle: string;
  additionalInfo?: string;
  // Security guard: Any attempt by client to pass role is rejected
  role?: string;
}

export interface AuthSessionResponse {
  user: DbUserRecord;
  patientProfile?: DbPatientProfileRecord | null;
  staffApplication?: DbStaffApplicationRecord | null;
  sessionToken: string;
  redirectRoute: string;
}

export class AuthService {
  /**
   * Generates a secure, cryptographically random session token.
   */
  private generateSessionToken(): string {
    return 'dna_sess_' + generateRandomHex(32);
  }

  /**
   * Determines redirection target route based on verified server-side role and account status.
   */
  getRedirectRouteForUser(user: DbUserRecord): string {
    if (user.account_status === 'suspended') {
      return 'auth:suspended';
    }

    switch (user.role) {
      case 'patient':
        return user.account_status === 'active' ? 'patient:profile' : 'auth:restricted';

      case 'staff':
        if (user.account_status === 'active') return 'staff:dashboard';
        if (user.account_status === 'pending') return 'staff:pending';
        if (user.account_status === 'rejected') return 'staff:rejected';
        return 'auth:restricted';

      case 'lab_owner':
        return user.account_status === 'active' ? 'owner:dashboard' : 'auth:restricted';

      case 'super_admin':
        return user.account_status === 'active' ? 'admin:overview' : 'auth:restricted';

      default:
        return 'public:home';
    }
  }

  /**
   * Processes a verified Google Identity:
   * - If existing user: creates session and returns profile with redirect.
   * - If new user: flags isNewUser = true so client proceeds to Account Type Selection (Patient vs Staff).
   */
  async processGoogleIdentity(identity: VerifiedGoogleIdentity): Promise<{
    isNewUser: boolean;
    session?: AuthSessionResponse;
    googleIdentity: VerifiedGoogleIdentity;
  }> {
    // 1. Look up user by Google UID or verified Email (duplicate account prevention)
    let user = await db.getUserByGoogleUid(identity.googleUid);
    if (!user) {
      user = await db.getUserByEmail(identity.email);
      // Link Google UID if matched by email
      if (user && !user.google_uid) {
        user = await db.updateUser(user.id, { google_uid: identity.googleUid }) || user;
      }
    }

    if (!user) {
      // New user flow
      return {
        isNewUser: true,
        googleIdentity: identity,
      };
    }

    // 2. Returning user flow: generate session
    const token = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await db.createSession({
      token,
      user_id: user.id,
      role: user.role,
      account_status: user.account_status,
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
    });

    const patientProfile = user.role === 'patient' ? await db.getPatientProfile(user.id) : null;
    const staffApplication = user.role === 'staff' ? await db.getStaffApplicationByUserId(user.id) : null;

    return {
      isNewUser: false,
      googleIdentity: identity,
      session: {
        user,
        patientProfile,
        staffApplication,
        sessionToken: token,
        redirectRoute: this.getRedirectRouteForUser(user),
      },
    };
  }

  /**
   * Server-Side Patient Registration:
   * Assigns role: 'patient' and status: 'active'. Rejects any privilege escalation attempt.
   */
  async registerPatient(
    identity: VerifiedGoogleIdentity,
    input: PatientRegistrationInput
  ): Promise<AuthSessionResponse> {
    // Strict Security Guard: Never allow client to request privileged roles
    if (input.role && input.role !== 'patient') {
      throw new Error('SECURITY_VIOLATION: Unauthorized role assignment attempt.');
    }

    // Duplicate account check
    let existing = await db.getUserByGoogleUid(identity.googleUid);
    if (!existing) {
      existing = await db.getUserByEmail(identity.email);
    }
    if (existing) {
      throw new Error('ACCOUNT_ALREADY_EXISTS: An account with this Google identity already exists.');
    }

    const now = new Date().toISOString();
    const userId = 'usr_pat_' + generateRandomHex(8);

    // 1. Create User Record (Server forces role = patient, status = active)
    const newUser: DbUserRecord = {
      id: userId,
      google_uid: identity.googleUid,
      full_name: input.fullName.trim() || identity.name,
      email: identity.email.toLowerCase(),
      phone: input.phone.trim(),
      photo_url: input.photoUrl || identity.photoUrl,
      role: 'patient',
      account_status: 'active',
      created_at: now,
      updated_at: now,
    };
    await db.createUser(newUser);

    // 2. Create Patient Profile Record
    const newProfile: DbPatientProfileRecord = {
      user_id: userId,
      date_of_birth: input.dateOfBirth,
      gender: input.gender,
      city: input.city.trim(),
      address: input.address?.trim(),
    };
    await db.setPatientProfile(newProfile);

    // 3. Issue Session Token
    const token = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await db.createSession({
      token,
      user_id: userId,
      role: 'patient',
      account_status: 'active',
      created_at: now,
      expires_at: expiresAt,
    });

    return {
      user: newUser,
      patientProfile: newProfile,
      sessionToken: token,
      redirectRoute: 'patient:profile',
    };
  }

  /**
   * Server-Side Staff Registration:
   * Assigns role: 'staff' and status: 'pending'. Staff cannot access staff functionality until approved by Lab Owner.
   */
  async registerStaff(
    identity: VerifiedGoogleIdentity,
    input: StaffRegistrationInput
  ): Promise<AuthSessionResponse> {
    // Strict Security Guard: Never allow client to request privileged roles
    if (input.role && input.role !== 'staff') {
      throw new Error('SECURITY_VIOLATION: Unauthorized role assignment attempt.');
    }

    // Duplicate account check
    let existing = await db.getUserByGoogleUid(identity.googleUid);
    if (!existing) {
      existing = await db.getUserByEmail(identity.email);
    }
    if (existing) {
      throw new Error('ACCOUNT_ALREADY_EXISTS: An account with this Google identity already exists.');
    }

    const now = new Date().toISOString();
    const userId = 'usr_stf_' + generateRandomHex(8);
    const applicationId = 'app_stf_' + generateRandomHex(8);

    // 1. Create User Record (Server forces role = staff, status = pending)
    const newUser: DbUserRecord = {
      id: userId,
      google_uid: identity.googleUid,
      full_name: input.fullName.trim() || identity.name,
      email: identity.email.toLowerCase(),
      phone: input.phone.trim(),
      photo_url: identity.photoUrl,
      role: 'staff',
      account_status: 'pending',
      created_at: now,
      updated_at: now,
    };
    await db.createUser(newUser);

    // 2. Create Staff Application Record (Status = pending)
    const newApplication: DbStaffApplicationRecord = {
      id: applicationId,
      user_id: userId,
      full_name: newUser.full_name,
      email: newUser.email,
      phone: newUser.phone,
      city: input.city.trim(),
      address: input.address?.trim(),
      job_title: input.jobTitle.trim(),
      additional_info: input.additionalInfo?.trim(),
      application_status: 'pending',
      submitted_at: now,
    };
    await db.createStaffApplication(newApplication);

    // 3. Issue Session Token
    const token = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await db.createSession({
      token,
      user_id: userId,
      role: 'staff',
      account_status: 'pending',
      created_at: now,
      expires_at: expiresAt,
    });

    return {
      user: newUser,
      staffApplication: newApplication,
      sessionToken: token,
      redirectRoute: 'staff:pending',
    };
  }

  /**
   * Approves a staff application:
   * STRICT SECURITY: Only the Laboratory Owner can approve staff accounts.
   */
  async approveStaffApplication(
    operatorUserId: string,
    applicationId: string
  ): Promise<{ success: boolean; application: DbStaffApplicationRecord }> {
    const operator = await db.getUserById(operatorUserId);
    if (!operator || operator.role !== 'lab_owner' || operator.account_status !== 'active') {
      throw new Error('ACCESS_DENIED: Only the verified Laboratory Owner can approve staff applications.');
    }

    const application = await db.getStaffApplicationById(applicationId);
    if (!application) {
      throw new Error('APPLICATION_NOT_FOUND');
    }

    // A staff member cannot approve their own application
    if (operator.id === application.user_id) {
      throw new Error('SECURITY_VIOLATION: Users cannot approve their own applications.');
    }

    const now = new Date().toISOString();

    // 1. Update application status
    const updatedApp = await db.updateStaffApplication(applicationId, {
      application_status: 'approved',
      reviewed_at: now,
      reviewed_by: operator.id,
    });

    // 2. Activate staff user account
    await db.updateUser(application.user_id, {
      account_status: 'active',
      updated_at: now,
    });

    return { success: true, application: updatedApp! };
  }

  /**
   * Rejects a staff application:
   * STRICT SECURITY: Only the Laboratory Owner can reject staff accounts.
   */
  async rejectStaffApplication(
    operatorUserId: string,
    applicationId: string,
    rejectionReason?: string
  ): Promise<{ success: boolean; application: DbStaffApplicationRecord }> {
    const operator = await db.getUserById(operatorUserId);
    if (!operator || operator.role !== 'lab_owner' || operator.account_status !== 'active') {
      throw new Error('ACCESS_DENIED: Only the verified Laboratory Owner can reject staff applications.');
    }

    const application = await db.getStaffApplicationById(applicationId);
    if (!application) {
      throw new Error('APPLICATION_NOT_FOUND');
    }

    const now = new Date().toISOString();

    const updatedApp = await db.updateStaffApplication(applicationId, {
      application_status: 'rejected',
      reviewed_at: now,
      reviewed_by: operator.id,
      rejection_reason: rejectionReason || 'Requirements criteria not satisfied.',
    });

    await db.updateUser(application.user_id, {
      account_status: 'rejected',
      updated_at: now,
    });

    return { success: true, application: updatedApp! };
  }

  /**
   * Validates a session token and returns the current user profile.
   */
  async validateSession(token: string): Promise<{
    user: DbUserRecord;
    patientProfile?: DbPatientProfileRecord | null;
    staffApplication?: DbStaffApplicationRecord | null;
  } | null> {
    const session = await db.getSession(token);
    if (!session) return null;

    const user = await db.getUserById(session.user_id);
    if (!user) return null;

    const patientProfile = user.role === 'patient' ? await db.getPatientProfile(user.id) : null;
    const staffApplication = user.role === 'staff' ? await db.getStaffApplicationByUserId(user.id) : null;

    return { user, patientProfile, staffApplication };
  }

  /**
   * Secure Logout: destroys session from database.
   */
  async logout(token: string): Promise<void> {
    await db.deleteSession(token);
  }
}

export const authService = new AuthService();
