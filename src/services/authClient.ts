/**
 * DNA Laboratory - Client Authentication Service
 * Communicates with server-side authentication engine & handles Google OAuth
 */

import { authService, VerifiedGoogleIdentity, PatientRegistrationInput, StaffRegistrationInput, AuthSessionResponse } from '../server/authService';
import { db, DbStaffApplicationRecord } from '../server/db';
import { User, UserRole, StaffStatus } from '../types/auth';

const SESSION_STORAGE_KEY = 'dna_lab_session_token';

export interface ClientAuthState {
  user: User | null;
  patientProfile: any | null;
  staffApplication: DbStaffApplicationRecord | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isPendingApproval: boolean;
  isRejected: boolean;
}

class AuthClient {
  private currentSession: AuthSessionResponse | null = null;

  /**
   * Checks if Google OAuth Client ID is configured in the environment.
   */
  getGoogleClientId(): string | null {
    // Check vite env var
    return (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || null;
  }

  /**
   * Authenticates with Google:
   * Accepts verified Google Identity payload (from Google Identity Services credential response or direct Google sign-in)
   */
  async authenticateWithGoogle(identity: VerifiedGoogleIdentity) {
    const result = await authService.processGoogleIdentity(identity);
    if (!result.isNewUser && result.session) {
      this.saveSessionToken(result.session.sessionToken);
      this.currentSession = result.session;
    }
    return result;
  }

  /**
   * Registers a new patient after Google authentication.
   */
  async registerPatient(identity: VerifiedGoogleIdentity, input: PatientRegistrationInput): Promise<AuthSessionResponse> {
    const session = await authService.registerPatient(identity, input);
    this.saveSessionToken(session.sessionToken);
    this.currentSession = session;
    return session;
  }

  /**
   * Registers a new staff applicant after Google authentication.
   */
  async registerStaff(identity: VerifiedGoogleIdentity, input: StaffRegistrationInput): Promise<AuthSessionResponse> {
    const session = await authService.registerStaff(identity, input);
    this.saveSessionToken(session.sessionToken);
    this.currentSession = session;
    return session;
  }

  /**
   * Approves staff application (Owner only).
   */
  async approveStaff(ownerUserId: string, applicationId: string) {
    return await authService.approveStaffApplication(ownerUserId, applicationId);
  }

  /**
   * Rejects staff application (Owner only).
   */
  async rejectStaff(ownerUserId: string, applicationId: string, reason?: string) {
    return await authService.rejectStaffApplication(ownerUserId, applicationId, reason);
  }

  /**
   * Retrieves pending and reviewed staff applications (for Laboratory Owner).
   */
  async getStaffApplications(operatorUserId: string): Promise<DbStaffApplicationRecord[]> {
    const operator = await db.getUserById(operatorUserId);
    if (!operator || operator.role !== 'lab_owner') {
      throw new Error('ACCESS_DENIED: Only Laboratory Owner can view staff applications.');
    }
    return await db.getAllStaffApplications();
  }

  /**
   * Restores existing active session from token.
   */
  async restoreSession(): Promise<AuthSessionResponse | null> {
    const token = this.getSessionToken();
    if (!token) return null;

    const data = await authService.validateSession(token);
    if (!data) {
      this.clearSessionToken();
      return null;
    }

    const session: AuthSessionResponse = {
      user: data.user,
      patientProfile: data.patientProfile,
      staffApplication: data.staffApplication,
      sessionToken: token,
      redirectRoute: authService.getRedirectRouteForUser(data.user),
    };

    this.currentSession = session;
    return session;
  }

  /**
   * Logout session.
   */
  async logout(): Promise<void> {
    const token = this.getSessionToken();
    if (token) {
      await authService.logout(token);
    }
    this.clearSessionToken();
    this.currentSession = null;
  }

  // Token storage helpers
  private saveSessionToken(token: string) {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, token);
    } catch {
      // Ignore in non-browser envs
    }
  }

  private getSessionToken(): string | null {
    try {
      return sessionStorage.getItem(SESSION_STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private clearSessionToken() {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

export const authClient = new AuthClient();
