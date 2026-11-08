/**
 * DNA Laboratory - Server-Side Database Architecture
 * Single-Tenant Medical Diagnostic Storage Engine
 */

export type UserRole = 'patient' | 'staff' | 'lab_owner' | 'super_admin';
export type AccountStatus = 'active' | 'pending' | 'rejected' | 'suspended';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface DbUserRecord {
  id: string;
  google_uid: string;
  full_name: string;
  email: string;
  phone: string;
  photo_url?: string;
  role: UserRole;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface DbPatientProfileRecord {
  user_id: string; // Foreign key to DbUserRecord.id
  date_of_birth?: string;
  gender?: 'male' | 'female';
  city: string;
  address?: string;
}

export interface DbStaffApplicationRecord {
  id: string;
  user_id: string; // Foreign key to DbUserRecord.id
  full_name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  job_title: string;
  additional_info?: string;
  application_status: ApplicationStatus;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string; // Foreign key to DbUserRecord.id (Laboratory Owner)
  rejection_reason?: string;
}

export interface DbSessionRecord {
  token: string;
  user_id: string;
  role: UserRole;
  account_status: AccountStatus;
  created_at: string;
  expires_at: string;
}

export interface DbAuditLogRecord {
  id: string;
  operator_id: string;
  operator_name: string;
  operator_role: UserRole;
  action: string;
  target_entity_type: string;
  target_entity_id: string;
  result: 'success' | 'failure';
  details: Record<string, any>;
  timestamp: string;
}

export interface DbSecurityEventRecord {
  id: string;
  event_type: 
    | 'login_success' 
    | 'login_failed' 
    | 'new_registration' 
    | 'staff_application' 
    | 'staff_decision' 
    | 'account_suspended' 
    | 'account_reactivated' 
    | 'unauthorized_access' 
    | 'privilege_escalation_attempt' 
    | 'config_change';
  user_id?: string;
  user_email?: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  result: 'allowed' | 'denied' | 'logged';
  metadata: Record<string, any>;
}

export interface SystemStatistics {
  totalUsers: number;
  totalPatients: number;
  totalStaff: number;
  pendingStaffApplications: number;
  activeAccounts: number;
  suspendedAccounts: number;
  systemHealth: 'healthy' | 'degraded' | 'warning';
  databaseConnectionStatus: 'connected' | 'unavailable';
  timestamp: string;
}

export interface DatabaseState {
  users: Map<string, DbUserRecord>;
  patient_profiles: Map<string, DbPatientProfileRecord>;
  staff_applications: Map<string, DbStaffApplicationRecord>;
  sessions: Map<string, DbSessionRecord>;
  audit_logs: DbAuditLogRecord[];
  security_events: DbSecurityEventRecord[];
}

// In-Memory Thread-Safe Medical Database Store
class MedicalDatabase {
  private users = new Map<string, DbUserRecord>();
  private patientProfiles = new Map<string, DbPatientProfileRecord>();
  private staffApplications = new Map<string, DbStaffApplicationRecord>();
  private sessions = new Map<string, DbSessionRecord>();
  private auditLogs: DbAuditLogRecord[] = [];
  private securityEvents: DbSecurityEventRecord[] = [];

  constructor() {
    this.seedTrustedAdministrativeAccounts();
  }

  /**
   * Seeds trusted, secure server-side administrative accounts.
   * Strict rule: Super Admin and Lab Owner CANNOT be registered through public signup.
   */
  private seedTrustedAdministrativeAccounts() {
    const timestamp = '2026-01-01T00:00:00.000Z';

    // 1. Trusted Laboratory Owner (Highest authority inside the medical laboratory)
    const ownerUser: DbUserRecord = {
      id: 'usr_owner_001',
      google_uid: 'google_owner_1092837465',
      full_name: 'د. فيصل القحطاني',
      email: 'owner@dnalab.internal',
      phone: '+966501112233',
      photo_url: '',
      role: 'lab_owner',
      account_status: 'active',
      created_at: timestamp,
      updated_at: timestamp,
    };
    this.users.set(ownerUser.id, ownerUser);

    // 2. Trusted Super Admin (Technical system administrator, isolated from clinical records)
    const adminUser: DbUserRecord = {
      id: 'usr_admin_001',
      google_uid: 'google_admin_9876543210',
      full_name: 'م. طارق العتيبي',
      email: 'admin@dnalab.internal',
      phone: '+966509998877',
      photo_url: '',
      role: 'super_admin',
      account_status: 'active',
      created_at: timestamp,
      updated_at: timestamp,
    };
    this.users.set(adminUser.id, adminUser);

    // 3. Seed an existing active staff member for workflow testing
    const activeStaffUser: DbUserRecord = {
      id: 'usr_staff_active_01',
      google_uid: 'google_staff_5566778899',
      full_name: 'أ.د. عبد العزيز الشمري',
      email: 'specialist@dnalab.internal',
      phone: '+966504445566',
      photo_url: '',
      role: 'staff',
      account_status: 'active',
      created_at: timestamp,
      updated_at: timestamp,
    };
    this.users.set(activeStaffUser.id, activeStaffUser);

    const activeApp: DbStaffApplicationRecord = {
      id: 'app_staff_active_01',
      user_id: activeStaffUser.id,
      full_name: activeStaffUser.full_name,
      email: activeStaffUser.email,
      phone: activeStaffUser.phone,
      city: 'الرياض',
      job_title: 'أخصائي وراثة جزيئية وفحص جينات',
      application_status: 'approved',
      submitted_at: '2026-01-02T10:00:00.000Z',
      reviewed_at: '2026-01-03T14:30:00.000Z',
      reviewed_by: ownerUser.id,
    };
    this.staffApplications.set(activeApp.id, activeApp);

    // 4. Seed bootstrap audit records
    this.auditLogs = [
      {
        id: 'audit_boot_001',
        operator_id: adminUser.id,
        operator_name: adminUser.full_name,
        operator_role: 'super_admin',
        action: 'PLATFORM_BOOTSTRAP',
        target_entity_type: 'platform',
        target_entity_id: 'dnalab_core',
        result: 'success',
        details: { mode: 'single_tenant', environment: 'production_ready' },
        timestamp: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'audit_boot_002',
        operator_id: adminUser.id,
        operator_name: adminUser.full_name,
        operator_role: 'super_admin',
        action: 'PROVISION_LAB_OWNER',
        target_entity_type: 'user',
        target_entity_id: ownerUser.id,
        result: 'success',
        details: { email: ownerUser.email, title: 'Medical Laboratory Director' },
        timestamp: '2026-01-01T00:05:00.000Z',
      },
      {
        id: 'audit_boot_003',
        operator_id: ownerUser.id,
        operator_name: ownerUser.full_name,
        operator_role: 'lab_owner',
        action: 'STAFF_APPROVE',
        target_entity_type: 'staff_application',
        target_entity_id: activeApp.id,
        result: 'success',
        details: { applicant_name: activeApp.full_name, role: 'staff' },
        timestamp: '2026-01-03T14:30:00.000Z',
      },
    ];

    // 5. Seed bootstrap security events
    this.securityEvents = [
      {
        id: 'sec_evt_001',
        event_type: 'config_change',
        user_id: adminUser.id,
        user_email: adminUser.email,
        severity: 'info',
        timestamp: '2026-01-01T00:00:00.000Z',
        result: 'logged',
        metadata: { action: 'INITIAL_SECURITY_BASELINE_SET' },
      },
      {
        id: 'sec_evt_002',
        event_type: 'login_success',
        user_id: ownerUser.id,
        user_email: ownerUser.email,
        severity: 'info',
        timestamp: '2026-01-01T00:06:00.000Z',
        result: 'allowed',
        metadata: { provider: 'google_workspace' },
      },
    ];
  }

  // --- Users Operations ---
  async getUserByGoogleUid(googleUid: string): Promise<DbUserRecord | null> {
    for (const user of this.users.values()) {
      if (user.google_uid === googleUid) {
        return { ...user };
      }
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<DbUserRecord | null> {
    const normalized = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.trim().toLowerCase() === normalized) {
        return { ...user };
      }
    }
    return null;
  }

  async getUserById(id: string): Promise<DbUserRecord | null> {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async createUser(user: DbUserRecord): Promise<DbUserRecord> {
    this.users.set(user.id, { ...user });
    return { ...user };
  }

  async updateUser(id: string, updates: Partial<DbUserRecord>): Promise<DbUserRecord | null> {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return { ...updated };
  }

  // --- Patient Profiles ---
  async getPatientProfile(userId: string): Promise<DbPatientProfileRecord | null> {
    const profile = this.patientProfiles.get(userId);
    return profile ? { ...profile } : null;
  }

  async setPatientProfile(profile: DbPatientProfileRecord): Promise<DbPatientProfileRecord> {
    this.patientProfiles.set(profile.user_id, { ...profile });
    return { ...profile };
  }

  // --- Staff Applications ---
  async getStaffApplicationByUserId(userId: string): Promise<DbStaffApplicationRecord | null> {
    for (const app of this.staffApplications.values()) {
      if (app.user_id === userId) {
        return { ...app };
      }
    }
    return null;
  }

  async getStaffApplicationById(id: string): Promise<DbStaffApplicationRecord | null> {
    const app = this.staffApplications.get(id);
    return app ? { ...app } : null;
  }

  async getAllStaffApplications(): Promise<DbStaffApplicationRecord[]> {
    return Array.from(this.staffApplications.values()).map(app => ({ ...app }));
  }

  async createStaffApplication(app: DbStaffApplicationRecord): Promise<DbStaffApplicationRecord> {
    this.staffApplications.set(app.id, { ...app });
    return { ...app };
  }

  async updateStaffApplication(id: string, updates: Partial<DbStaffApplicationRecord>): Promise<DbStaffApplicationRecord | null> {
    const existing = this.staffApplications.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
    };
    this.staffApplications.set(id, updated);
    return { ...updated };
  }

  // --- Sessions Operations ---
  async createSession(session: DbSessionRecord): Promise<DbSessionRecord> {
    this.sessions.set(session.token, { ...session });
    return { ...session };
  }

  async getSession(token: string): Promise<DbSessionRecord | null> {
    const session = this.sessions.get(token);
    if (!session) return null;
    if (new Date(session.expires_at).getTime() < Date.now()) {
      this.sessions.delete(token);
      return null;
    }
    return { ...session };
  }

  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  async getAllUsers(): Promise<DbUserRecord[]> {
    return Array.from(this.users.values()).map(u => ({ ...u }));
  }

  // --- Audit Logs (Append-Only & Immutable) ---
  async createAuditLog(entry: Omit<DbAuditLogRecord, 'id' | 'timestamp'> & { timestamp?: string }): Promise<DbAuditLogRecord> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: DbAuditLogRecord = {
      ...entry,
      id,
      timestamp: entry.timestamp || new Date().toISOString(),
    };
    this.auditLogs.unshift(record);
    return { ...record };
  }

  async getAuditLogs(operatorRole?: UserRole): Promise<DbAuditLogRecord[]> {
    // Only Super Admin and Laboratory Owner can view audit logs
    if (operatorRole && operatorRole !== 'super_admin' && operatorRole !== 'lab_owner') {
      throw new Error('ACCESS_DENIED: Only Super Admin and Laboratory Owner can review audit history.');
    }
    return this.auditLogs.map(log => ({ ...log }));
  }

  async deleteAuditLog(_logId: string): Promise<never> {
    // Audit logs are append-only by medical compliance design
    throw new Error('SECURITY_VIOLATION: Audit logs are append-only and strictly immutable. Deletion is prohibited.');
  }

  // --- Security Events Monitoring ---
  async createSecurityEvent(evt: Omit<DbSecurityEventRecord, 'id' | 'timestamp'> & { timestamp?: string }): Promise<DbSecurityEventRecord> {
    const id = `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: DbSecurityEventRecord = {
      ...evt,
      id,
      timestamp: evt.timestamp || new Date().toISOString(),
    };
    this.securityEvents.unshift(record);
    return { ...record };
  }

  async getSecurityEvents(operatorRole?: UserRole): Promise<DbSecurityEventRecord[]> {
    if (operatorRole && operatorRole !== 'super_admin') {
      throw new Error('ACCESS_DENIED: Security monitoring is restricted to Super Admin technical platform authority.');
    }
    return this.securityEvents.map(evt => ({ ...evt }));
  }

  // --- Administrative User Status Management ---
  async suspendUser(operatorUserId: string, targetUserId: string, reason: string): Promise<DbUserRecord> {
    const operator = await this.getUserById(operatorUserId);
    if (!operator || operator.role !== 'super_admin' || operator.account_status !== 'active') {
      throw new Error('ACCESS_DENIED: Only active Super Admin can suspend accounts.');
    }

    if (operatorUserId === targetUserId) {
      throw new Error('SECURITY_VIOLATION: Super Admin cannot suspend their own account.');
    }

    const targetUser = await this.getUserById(targetUserId);
    if (!targetUser) {
      throw new Error('USER_NOT_FOUND: User does not exist.');
    }

    if (targetUser.role === 'lab_owner') {
      throw new Error('SECURITY_VIOLATION: Laboratory Owner cannot be suspended through standard user management.');
    }

    const now = new Date().toISOString();
    const updated = await this.updateUser(targetUserId, {
      account_status: 'suspended',
      updated_at: now,
    });

    // Invalidate any active sessions for the suspended user
    for (const [token, session] of this.sessions.entries()) {
      if (session.user_id === targetUserId) {
        this.sessions.delete(token);
      }
    }

    // Record audit log & security event
    await this.createAuditLog({
      operator_id: operator.id,
      operator_name: operator.full_name,
      operator_role: operator.role,
      action: 'USER_SUSPEND',
      target_entity_type: 'user',
      target_entity_id: targetUserId,
      result: 'success',
      details: { reason, target_email: targetUser.email, target_role: targetUser.role },
      timestamp: now,
    });

    await this.createSecurityEvent({
      event_type: 'account_suspended',
      user_id: targetUserId,
      user_email: targetUser.email,
      severity: 'warning',
      result: 'logged',
      metadata: { suspendedBy: operator.email, reason },
      timestamp: now,
    });

    return updated!;
  }

  async reactivateUser(operatorUserId: string, targetUserId: string): Promise<DbUserRecord> {
    const operator = await this.getUserById(operatorUserId);
    if (!operator || operator.role !== 'super_admin' || operator.account_status !== 'active') {
      throw new Error('ACCESS_DENIED: Only active Super Admin can reactivate accounts.');
    }

    const targetUser = await this.getUserById(targetUserId);
    if (!targetUser) {
      throw new Error('USER_NOT_FOUND: User does not exist.');
    }

    const now = new Date().toISOString();
    const updated = await this.updateUser(targetUserId, {
      account_status: 'active',
      updated_at: now,
    });

    await this.createAuditLog({
      operator_id: operator.id,
      operator_name: operator.full_name,
      operator_role: operator.role,
      action: 'USER_REACTIVATE',
      target_entity_type: 'user',
      target_entity_id: targetUserId,
      result: 'success',
      details: { target_email: targetUser.email, target_role: targetUser.role },
      timestamp: now,
    });

    await this.createSecurityEvent({
      event_type: 'account_reactivated',
      user_id: targetUserId,
      user_email: targetUser.email,
      severity: 'info',
      result: 'logged',
      metadata: { reactivatedBy: operator.email },
      timestamp: now,
    });

    return updated!;
  }

  // --- Real Database System Statistics ---
  async getSystemStatistics(): Promise<SystemStatistics> {
    const allUsers = Array.from(this.users.values());
    const allApps = Array.from(this.staffApplications.values());

    const totalUsers = allUsers.length;
    const totalPatients = allUsers.filter(u => u.role === 'patient').length;
    const totalStaff = allUsers.filter(u => u.role === 'staff').length;
    const pendingStaffApplications = allApps.filter(a => a.application_status === 'pending').length;
    const activeAccounts = allUsers.filter(u => u.account_status === 'active').length;
    const suspendedAccounts = allUsers.filter(u => u.account_status === 'suspended').length;

    return {
      totalUsers,
      totalPatients,
      totalStaff,
      pendingStaffApplications,
      activeAccounts,
      suspendedAccounts,
      systemHealth: 'healthy',
      databaseConnectionStatus: 'connected',
      timestamp: new Date().toISOString(),
    };
  }

  // Helper for automated test resets
  async resetForTesting(): Promise<void> {
    this.users.clear();
    this.patientProfiles.clear();
    this.staffApplications.clear();
    this.sessions.clear();
    this.auditLogs = [];
    this.securityEvents = [];
    this.seedTrustedAdministrativeAccounts();
  }
}

export const db = new MedicalDatabase();
