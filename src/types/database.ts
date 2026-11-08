/**
 * Database Architecture Schema & Entity Relationships
 * DNA Laboratory — Single-Tenant Medical Diagnostic Architecture
 */

import { UserRole, StaffStatus, PermissionAction } from './auth';

// 1. Core Identity & RBAC
export interface DbUser {
  id: string; // Primary key (Firebase UID / DB UUID)
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface DbUserProfile {
  userId: string; // FK -> DbUser.id
  fullNameAr: string;
  fullNameEn: string;
  phone: string;
  avatarUrl?: string;
  nationalId?: string;
  metadata?: Record<string, unknown>;
}

export interface DbStaffApplication {
  id: string;
  userId: string; // FK -> DbUser.id
  applicantName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  status: StaffStatus;
  appliedAt: string;
  reviewedBy?: string; // FK -> DbUser.id (Lab Owner)
  reviewedAt?: string;
  reviewNotes?: string;
}

// 2. Laboratory Configuration (Single-Tenant)
export interface DbLaboratorySettings {
  id: 'laboratory_main_config'; // Singleton document
  nameAr: string;
  nameEn: string;
  licenseNumber: string;
  contactEmail: string;
  contactPhone: string;
  emergencyPhone?: string;
  addressAr: string;
  addressEn: string;
  operatingHours: {
    daysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
    openTime: string; // HH:mm
    closeTime: string; // HH:mm
  };
  sampleCollectionPolicy: string;
  reportHeaderLogoUrl?: string;
  isOnlineBookingEnabled: boolean;
  maxDailyAppointments: number;
}

// 3. Test Catalog & Pricing
export interface DbTestCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  sortOrder: number;
  isActive: boolean;
}

export interface DbLaboratoryTest {
  id: string;
  categoryId: string; // FK -> DbTestCategory.id
  code: string; // e.g. "DNA-GEN-001"
  nameAr: string;
  nameEn: string;
  sampleType: 'Blood' | 'Serum' | 'Saliva' | 'Tissue' | 'Swab' | 'Urine';
  turnaroundTimeHours: number;
  price: number;
  currency: string; // e.g. "SAR"
  fastingRequired: boolean;
  fastingHours?: number;
  specialPrecautionsAr?: string;
  specialPrecautionsEn?: string;
  normalRange?: string;
  isActive: boolean;
}

// 4. Patients & Permanent Medical Records
export interface DbPatient {
  id: string;
  userId: string; // FK -> DbUser.id
  fileNumber: string; // Unique Medical Record Number (MRN), e.g. "DNA-MRN-10023"
  dateOfBirth: string;
  gender: 'male' | 'female';
  bloodGroup?: string;
  chronicConditions?: string[];
  allergies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DbPatientMedicalRecord {
  id: string;
  patientId: string; // FK -> DbPatient.id
  summaryNotes?: string;
  totalVisitsCount: number;
  totalTestsCount: number;
  isLocked: boolean; // Protect from unauthorized changes
  lastVisitDate?: string;
  updatedAt: string;
}

export interface DbPatientVisit {
  id: string;
  patientId: string; // FK -> DbPatient.id
  visitDate: string;
  attendingStaffId?: string; // FK -> DbUser.id
  notes?: string;
  status: 'admitted' | 'sample_collected' | 'analyzing' | 'completed' | 'cancelled';
  testIds: string[]; // FKs -> DbLaboratoryTest.id
}

// 5. Appointments
export interface DbAppointment {
  id: string;
  patientId: string; // FK -> DbPatient.id
  testIds: string[]; // FKs -> DbLaboratoryTest.id
  scheduledDateTime: string;
  status: 'pending_confirmation' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  homeSamplingRequested: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 6. Samples
export interface DbSample {
  id: string;
  barcode: string; // e.g. "DNA-SMP-89231"
  patientId: string; // FK -> DbPatient.id
  testId: string; // FK -> DbLaboratoryTest.id
  visitId?: string; // FK -> DbPatientVisit.id
  sampleType: string;
  collectedAt: string;
  collectedByStaffId: string; // FK -> DbUser.id
  status: 'collected' | 'received_in_lab' | 'in_analysis' | 'tested' | 'rejected';
  rejectionReason?: string;
}

// 7. Results & Medical Reports
export interface DbTestResult {
  id: string;
  sampleId: string; // FK -> DbSample.id
  testId: string; // FK -> DbLaboratoryTest.id
  patientId: string; // FK -> DbPatient.id
  numericValue?: number;
  unit?: string;
  qualitativeResult?: 'positive' | 'negative' | 'inconclusive' | 'detected' | 'not_detected';
  referenceRange?: string;
  isAbnormal: boolean;
  clinicalInterpretationAr?: string;
  clinicalInterpretationEn?: string;
  enteredByStaffId: string; // FK -> DbUser.id
  enteredAt: string;
  verifiedByStaffId?: string; // FK -> DbUser.id
  verifiedAt?: string;
  finalApprovalByOwnerId?: string; // FK -> DbUser.id (Lab Owner)
  status: 'draft' | 'verified' | 'finalized';
}

export interface DbMedicalReport {
  id: string;
  reportNumber: string; // e.g. "REP-2026-0045"
  patientId: string; // FK -> DbPatient.id
  resultIds: string[]; // FKs -> DbTestResult.id
  issueDate: string;
  authorizedSignatoryStaffId: string; // FK -> DbUser.id
  digitalSignatureHash: string; // Cryptographic hash verifying authenticity
  pdfStoragePath?: string; // Secure path
  isAccessibleToPatient: boolean;
}

// 8. Communications & Notifications
export interface DbConversation {
  id: string;
  participantUserIds: string[]; // FKs -> DbUser.id
  topic: string;
  relatedAppointmentId?: string;
  createdAt: string;
  isArchivedByOwner: boolean; // Administrative protection
  lastMessageAt: string;
}

export interface DbMessage {
  id: string;
  conversationId: string; // FK -> DbConversation.id
  senderUserId: string; // FK -> DbUser.id
  senderRole: UserRole;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface DbNotification {
  id: string;
  recipientUserId: string; // FK -> DbUser.id
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  type: 'appointment' | 'result_ready' | 'staff_application' | 'system_alert';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

// 9. Compliance, Audit & Recovery
export interface DbAuditLog {
  id: string;
  actorUserId: string; // FK -> DbUser.id
  actorRole: UserRole;
  action: PermissionAction;
  targetEntity: string; // e.g. 'PatientMedicalRecord', 'TestResult'
  targetEntityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DbBackupRecord {
  id: string;
  backupType: 'full' | 'incremental' | 'audit_snapshot';
  fileStoragePath: string;
  sizeBytes: number;
  checksum: string;
  initiatedByUserId: string; // FK -> DbUser.id (Super Admin or automated cron)
  status: 'success' | 'failed' | 'in_progress';
  completedAt?: string;
}
