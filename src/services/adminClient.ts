/**
 * DNA Laboratory - Client Adapter for Administrative Operations
 * Phase 03: Super Admin & Laboratory Owner Management System
 */

import { adminService, PlatformHealthStatus, LaboratoryOwnerProfileSummary } from '../server/adminService';
import { DbUserRecord, DbAuditLogRecord, DbSecurityEventRecord, SystemStatistics } from '../server/db';

class AdminClient {
  /**
   * Super Admin: Platform overview with live database statistics.
   */
  async getSystemOverview(operatorUserId: string): Promise<{
    statistics: SystemStatistics;
    recentSecurityEvents: DbSecurityEventRecord[];
    recentAuditLogs: DbAuditLogRecord[];
  }> {
    return await adminService.getSystemOverview(operatorUserId);
  }

  /**
   * Super Admin: All user accounts for management.
   */
  async getAllUserAccounts(operatorUserId: string): Promise<DbUserRecord[]> {
    return await adminService.getAllUserAccounts(operatorUserId);
  }

  /**
   * Super Admin: Laboratory Owner profile and status.
   */
  async getLaboratoryOwnerDetails(operatorUserId: string): Promise<LaboratoryOwnerProfileSummary> {
    return await adminService.getLaboratoryOwnerDetails(operatorUserId);
  }

  /**
   * Super Admin: Suspend a user account.
   */
  async suspendUser(operatorUserId: string, targetUserId: string, reason: string): Promise<DbUserRecord> {
    return await adminService.suspendUserAccount(operatorUserId, targetUserId, reason);
  }

  /**
   * Super Admin: Reactivate a suspended user account.
   */
  async reactivateUser(operatorUserId: string, targetUserId: string): Promise<DbUserRecord> {
    return await adminService.reactivateUserAccount(operatorUserId, targetUserId);
  }

  /**
   * Super Admin: Security monitoring events.
   */
  async getSecurityEvents(operatorUserId: string): Promise<DbSecurityEventRecord[]> {
    return await adminService.getSecurityEvents(operatorUserId);
  }

  /**
   * Super Admin / Lab Owner: Append-only audit logs.
   */
  async getAuditLogs(operatorUserId: string): Promise<DbAuditLogRecord[]> {
    return await adminService.getAuditLogs(operatorUserId);
  }

  /**
   * Super Admin: Platform health and telemetry.
   */
  async getPlatformHealth(operatorUserId: string): Promise<PlatformHealthStatus> {
    return await adminService.getPlatformHealth(operatorUserId);
  }

  /**
   * Laboratory Owner: Lab overview.
   */
  async getLaboratoryOwnerOverview(operatorUserId: string) {
    return await adminService.getLaboratoryOwnerOverview(operatorUserId);
  }

  /**
   * Laboratory Owner: Approve staff application.
   */
  async approveStaff(operatorUserId: string, applicationId: string) {
    return await adminService.approveStaff(operatorUserId, applicationId);
  }

  /**
   * Laboratory Owner: Reject staff application.
   */
  async rejectStaff(operatorUserId: string, applicationId: string, reason?: string) {
    return await adminService.rejectStaff(operatorUserId, applicationId, reason);
  }

  /**
   * Laboratory Owner: View audit history.
   */
  async getOwnerAuditLogs(operatorUserId: string): Promise<DbAuditLogRecord[]> {
    return await adminService.getOwnerAuditLogs(operatorUserId);
  }
}

export const adminClient = new AdminClient();
