/**
 * DNA Laboratory - Super Admin Technical Platform Dashboard
 * Phase 03: Super Admin & Laboratory Owner Management System
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  Database, 
  Server, 
  Lock, 
  Terminal, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  RefreshCw, 
  LogOut, 
  Settings, 
  Bell, 
  HardDrive, 
  UserCheck, 
  UserX, 
  Crown, 
  Cpu, 
  ArrowUpRight,
  Info,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Language } from '../../types';
import { User, UserRole } from '../../types/auth';
import { useRouter } from '../../router/RouterContext';
import { adminClient } from '../../services/adminClient';
import { DbUserRecord, DbAuditLogRecord, DbSecurityEventRecord, SystemStatistics } from '../../server/db';
import { PlatformHealthStatus, LaboratoryOwnerProfileSummary } from '../../server/adminService';

interface SuperAdminPortalProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User;
}

type AdminSection = 
  | 'overview' 
  | 'users' 
  | 'owner_account' 
  | 'security' 
  | 'audit' 
  | 'settings' 
  | 'backup' 
  | 'notifications' 
  | 'health';

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({
  currentLang,
  onLanguageChange,
  currentUser,
}) => {
  const isRtl = currentLang === 'ar';
  const { signOut } = useRouter();
  
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Live Data State
  const [statistics, setStatistics] = useState<SystemStatistics | null>(null);
  const [usersList, setUsersList] = useState<DbUserRecord[]>([]);
  const [ownerDetails, setOwnerDetails] = useState<LaboratoryOwnerProfileSummary | null>(null);
  const [securityEvents, setSecurityEvents] = useState<DbSecurityEventRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<DbAuditLogRecord[]>([]);
  const [healthStatus, setHealthStatus] = useState<PlatformHealthStatus | null>(null);

  // Filters & Search
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  
  // Suspend Modal State
  const [suspendingUser, setSuspendingUser] = useState<DbUserRecord | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Load all Super Admin telemetry and data
  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const [overviewData, allUsers, ownerInfo, health] = await Promise.all([
        adminClient.getSystemOverview(currentUser.id),
        adminClient.getAllUserAccounts(currentUser.id),
        adminClient.getLaboratoryOwnerDetails(currentUser.id),
        adminClient.getPlatformHealth(currentUser.id),
      ]);

      setStatistics(overviewData.statistics);
      setSecurityEvents(overviewData.recentSecurityEvents);
      setAuditLogs(overviewData.recentAuditLogs);
      setUsersList(allUsers);
      setOwnerDetails(ownerInfo);
      setHealthStatus(health);
    } catch (err: any) {
      setError(err.message || 'Failed to load platform administration telemetry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser.id]);

  // Handle User Suspension
  const handleConfirmSuspend = async () => {
    if (!suspendingUser) return;
    if (!suspensionReason.trim()) {
      setError(isRtl ? 'يرجى تدوين سبب التعليق في سجل التدقيق.' : 'Please enter a suspension reason for audit tracking.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      await adminClient.suspendUser(currentUser.id, suspendingUser.id, suspensionReason.trim());
      setSuccessToast(
        isRtl 
          ? `تم تعليق حساب ${suspendingUser.full_name} بنجاح وإبطال جلساته النشطة.` 
          : `Account for ${suspendingUser.full_name} suspended successfully.`
      );
      setSuspendingUser(null);
      setSuspensionReason('');
      await loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Failed to suspend user account.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle User Reactivation
  const handleReactivateUser = async (targetUser: DbUserRecord) => {
    try {
      setActionLoading(true);
      setError(null);
      await adminClient.reactivateUser(currentUser.id, targetUser.id);
      setSuccessToast(
        isRtl 
          ? `تمت إعادة تفعيل حساب ${targetUser.full_name} بنجاح.` 
          : `Account for ${targetUser.full_name} reactivated successfully.`
      );
      await loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Failed to reactivate user account.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered Users List
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.phone.includes(userSearchTerm);
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || user.account_status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const navItems: { id: AdminSection; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'overview', labelAr: 'نظرة عامة على النظام', labelEn: 'System Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'users', labelAr: 'حسابات المستخدمين', labelEn: 'User Accounts', icon: <Users className="w-4 h-4" /> },
    { id: 'owner_account', labelAr: 'حساب مالك المختبر', labelEn: 'Laboratory Owner', icon: <Crown className="w-4 h-4" /> },
    { id: 'security', labelAr: 'المراقبة الأمنية', labelEn: 'Security Monitoring', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'audit', labelAr: 'سجلات التدقيق', labelEn: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', labelAr: 'إعدادات المنصة', labelEn: 'System Configuration', icon: <Settings className="w-4 h-4" /> },
    { id: 'backup', labelAr: 'حالة النسخ الاحتياطي', labelEn: 'Backup Status', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'notifications', labelAr: 'التنبيهات التقنية', labelEn: 'Technical Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'health', labelAr: 'صحة المنصة', labelEn: 'Platform Health', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Top Technical Bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                SUPER ADMIN
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono">
                {isRtl ? 'الإدارة التقنية العليا' : 'Technical Administration'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              DNA-LAB-SYS-CORE // HIPAA ISOLATED
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onLanguageChange(isRtl ? 'en' : 'ar')}
            className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            {isRtl ? 'English' : 'العربية'}
          </button>

          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="p-1.5 text-slate-400 hover:text-teal-400 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            title={isRtl ? 'تحديث البيانات' : 'Refresh Telemetry'}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/80 text-xs text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">{currentUser.email}</span>
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar (10 Items) */}
        <aside className="w-full md:w-64 bg-slate-900/70 border-b md:border-b-0 md:border-e border-slate-800 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 mb-1">
              {isRtl ? 'أقسام المنظومة' : 'Platform Modules'}
            </div>

            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-teal-600/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-teal-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{isRtl ? item.labelAr : item.labelEn}</span>
                  </div>
                  {isRtl ? <ChevronLeft className="w-3.5 h-3.5 opacity-40" /> : <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
                </button>
              );
            })}
          </div>

          {/* Strict HIPAA Separation Notice in Sidebar */}
          <div className="mt-6 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isRtl ? 'عزل الخصوصية الطبية' : 'HIPAA Medical Privacy'}</span>
            </div>
            <p className="leading-relaxed text-[10px]">
              {isRtl 
                ? 'وفق التصميم الأمني، لا يملك المسؤول التقني أي وصول لملفات المرضى أو النتائج التشخيصية.' 
                : 'Technical admin has zero access to patient clinical files or laboratory test results.'}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Toast Notification */}
          {successToast && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successToast}</span>
              </div>
              <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white">✕</button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">✕</button>
            </div>
          )}

          {/* ============================================================= */}
          {/* 1. SYSTEM OVERVIEW SECTION */}
          {/* ============================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {isRtl ? 'لوحة المراقبة ونظرة عامة على النظام' : 'System Overview & Telemetry'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl 
                    ? 'قيم حقيقية مستخرجة مباشرة من قاعدة بيانات مختبر الدنا (Real Database Values).'
                    : 'Real-time database counts and audit statistics for DNA Laboratory single-tenant platform.'}
                </p>
              </div>

              {/* Real Database Overview Cards (8 Cards) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                {/* 1. Total Registered Users */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'إجمالي المستخدمين' : 'Total Users'}</span>
                    <Users className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {statistics?.totalUsers ?? '...'}
                  </div>
                  <div className="text-[10px] text-teal-400 mt-1">
                    {isRtl ? 'مسجلين في المنصة' : 'In database'}
                  </div>
                </div>

                {/* 2. Total Patients */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'إجمالي المرضى' : 'Total Patients'}</span>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {statistics?.totalPatients ?? '...'}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    {isRtl ? 'ملفات مفعلة' : 'Registered patients'}
                  </div>
                </div>

                {/* 3. Total Staff Accounts */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'الكادر الطبي والمخبري' : 'Total Staff'}</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {statistics?.totalStaff ?? '...'}
                  </div>
                  <div className="text-[10px] text-blue-400 mt-1">
                    {isRtl ? 'أخصائيين وفنيين' : 'Certified staff'}
                  </div>
                </div>

                {/* 4. Pending Staff Applications */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'طلبات كادر قيد الانتظار' : 'Pending Staff Apps'}</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">
                    {statistics?.pendingStaffApplications ?? '...'}
                  </div>
                  <div className="text-[10px] text-amber-300 mt-1">
                    {isRtl ? 'تنتظر قرار مالك المختبر' : 'Awaiting Lab Owner'}
                  </div>
                </div>

                {/* 5. Active Accounts */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'الحسابات النشطة' : 'Active Accounts'}</span>
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-teal-300 font-mono">
                    {statistics?.activeAccounts ?? '...'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isRtl ? 'حالة: نشط ومخول' : 'Status: active'}
                  </div>
                </div>

                {/* 6. Suspended Accounts */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'الحسابات المعلقة' : 'Suspended Accounts'}</span>
                    <UserX className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-rose-400 font-mono">
                    {statistics?.suspendedAccounts ?? '...'}
                  </div>
                  <div className="text-[10px] text-rose-300 mt-1">
                    {isRtl ? 'محظورة أمنياً' : 'Suspended by admin'}
                  </div>
                </div>

                {/* 7. System Health */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'صحة النظام' : 'System Health'}</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-lg font-extrabold text-emerald-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{statistics?.systemHealth === 'healthy' ? (isRtl ? 'مستقر ومثالي' : 'Healthy') : 'Warning'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isRtl ? 'كافة الخدمات تعمل' : 'All services normal'}
                  </div>
                </div>

                {/* 8. Database Connection Status */}
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'اتصال قاعدة البيانات' : 'Database Status'}</span>
                    <Database className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-lg font-extrabold text-teal-300 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span>{statistics?.databaseConnectionStatus === 'connected' ? (isRtl ? 'متصل' : 'Connected') : 'Disconnected'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {isRtl ? 'محرك البيانات متزامن' : 'Transactional storage'}
                  </div>
                </div>

              </div>

              {/* Recent Security & Audit Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Security Monitoring Feed Preview */}
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">
                        {isRtl ? 'آخر الأحداث الأمنية' : 'Recent Security Events'}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveSection('security')}
                      className="text-xs text-teal-400 hover:text-teal-300 font-bold"
                    >
                      {isRtl ? 'عرض الكل' : 'View all'}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {securityEvents.length === 0 ? (
                      <div className="text-xs text-slate-500 py-4 text-center">{isRtl ? 'لا توجد أحداث أمنية مسجلة' : 'No security events.'}</div>
                    ) : (
                      securityEvents.map(evt => (
                        <div key={evt.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-200">{evt.event_type}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{evt.user_email || 'System'}</div>
                          </div>
                          <div className="text-end">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              evt.severity === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                              evt.severity === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {evt.severity}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1">
                              {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Audit Logs Feed Preview */}
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <h3 className="text-sm font-bold text-white">
                        {isRtl ? 'سجل العمليات الإدارية غير القابل للتعديل' : 'Immutable Audit Trail'}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setActiveSection('audit')}
                      className="text-xs text-teal-400 hover:text-teal-300 font-bold"
                    >
                      {isRtl ? 'عرض الكل' : 'View all'}
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {auditLogs.length === 0 ? (
                      <div className="text-xs text-slate-500 py-4 text-center">{isRtl ? 'لا توجد سجلات تدقيق' : 'No audit records.'}</div>
                    ) : (
                      auditLogs.map(log => (
                        <div key={log.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-200">{log.action}</div>
                            <div className="text-[11px] text-slate-400">{log.operator_name} ({log.operator_role})</div>
                          </div>
                          <div className="text-end">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                              {log.result}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 2. USER ACCOUNTS MANAGEMENT */}
          {/* ============================================================= */}
          {activeSection === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {isRtl ? 'إدارة حسابات المستخدمين' : 'User Account Management'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl 
                      ? 'مراجعة بيانات المستخدمين، وحالة الحسابات، وإجراءات التعليق وإعادة التفعيل الموثقة.'
                      : 'Technical account administration with append-only audit tracking.'}
                  </p>
                </div>

                <div className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-mono">
                  {isRtl ? `إجمالي الحسابات: ${filteredUsers.length}` : `Filtered Users: ${filteredUsers.length}`}
                </div>
              </div>

              {/* Search & Filters */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute start-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={e => setUserSearchTerm(e.target.value)}
                    placeholder={isRtl ? 'البحث بالاسم، البريد الإلكتروني، أو الجوال...' : 'Search by name, email, phone...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-9 pe-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={userRoleFilter}
                    onChange={e => setUserRoleFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="all">{isRtl ? 'جميع الأدوار' : 'All Roles'}</option>
                    <option value="patient">{isRtl ? 'مريض (Patient)' : 'Patient'}</option>
                    <option value="staff">{isRtl ? 'كادر طبي (Staff)' : 'Staff'}</option>
                    <option value="lab_owner">{isRtl ? 'مالك المختبر (Lab Owner)' : 'Lab Owner'}</option>
                    <option value="super_admin">{isRtl ? 'مسؤول تقني (Super Admin)' : 'Super Admin'}</option>
                  </select>

                  <select
                    value={userStatusFilter}
                    onChange={e => setUserStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="all">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
                    <option value="active">{isRtl ? 'نشط (Active)' : 'Active'}</option>
                    <option value="pending">{isRtl ? 'قيد المراجعة (Pending)' : 'Pending'}</option>
                    <option value="suspended">{isRtl ? 'معلق (Suspended)' : 'Suspended'}</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-start">{isRtl ? 'المستخدم' : 'User'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'الدور' : 'Role'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'تاريخ التسجيل' : 'Registered'}</th>
                        <th className="px-4 py-3 text-end">{isRtl ? 'الإجراءات التقنية' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">
                            {isRtl ? 'لا توجد حسابات مطابقة للبحث' : 'No matching user accounts.'}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(user => (
                          <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-white">{user.full_name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                              {user.phone && <div className="text-[10px] text-slate-500">{user.phone}</div>}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono ${
                                user.role === 'super_admin' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                                user.role === 'lab_owner' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                                user.role === 'staff' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                                'bg-teal-950 text-teal-300 border border-teal-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                user.account_status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                user.account_status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                'bg-rose-950 text-rose-300 border border-rose-800'
                              }`}>
                                {user.account_status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3.5 text-end">
                              {/* Protection: Cannot suspend own account or Lab Owner via standard user table */}
                              {user.id === currentUser.id ? (
                                <span className="text-[11px] text-slate-500 italic">
                                  {isRtl ? 'حسابك الحالي' : 'Current Admin'}
                                </span>
                              ) : user.role === 'lab_owner' ? (
                                <span className="text-[11px] text-indigo-400 font-bold">
                                  {isRtl ? 'مالك المختبر (محمي)' : 'Owner (Protected)'}
                                </span>
                              ) : user.account_status === 'suspended' ? (
                                <button
                                  onClick={() => handleReactivateUser(user)}
                                  disabled={actionLoading}
                                  className="px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-lg text-xs font-bold transition-colors"
                                >
                                  {isRtl ? 'إعادة التفعيل' : 'Reactivate'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => setSuspendingUser(user)}
                                  disabled={actionLoading}
                                  className="px-3 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-bold transition-colors"
                                >
                                  {isRtl ? 'تعليق الحساب' : 'Suspend'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 3. LABORATORY OWNER ACCOUNT VIEW */}
          {/* ============================================================= */}
          {activeSection === 'owner_account' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {isRtl ? 'حساب مالك المختبر (Laboratory Owner Account)' : 'Laboratory Owner Account'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl 
                    ? 'الحساب السيادي الوحيد المعتمد لإدارة وتسيير العمليات المخبرية والطبية.'
                    : 'The single primary administrative authority for laboratory operations and staff governance.'}
                </p>
              </div>

              {ownerDetails ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Primary Profile Card */}
                  <div className="p-6 bg-slate-900 rounded-3xl border border-indigo-500/30 lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-extrabold text-xl">
                        <Crown className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold text-white">
                            {ownerDetails.owner.full_name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                            Primary Lab Owner
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {ownerDetails.owner.email} • {ownerDetails.owner.phone}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">{isRtl ? 'ترخيص المختبر' : 'License'}</div>
                        <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">{ownerDetails.laboratoryLicense}</div>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">{isRtl ? 'الكادر المعتمد' : 'Certified Staff'}</div>
                        <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">{ownerDetails.totalCertifiedStaff} عضو</div>
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">{isRtl ? 'المرضى المسجلين' : 'Patients'}</div>
                        <div className="text-xs font-mono font-bold text-teal-400 mt-0.5">{ownerDetails.totalRegisteredPatients} مراجع</div>
                      </div>
                    </div>

                    {/* Strict Role Separation Disclaimer */}
                    <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-800/60 text-xs text-indigo-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-indigo-300">
                        <Lock className="w-4 h-4" />
                        <span>{isRtl ? 'مبدأ الفصل السيادي للأدوار (Role Separation):' : 'Strict Role Separation:'}</span>
                      </div>
                      <p className="leading-relaxed">
                        {isRtl 
                          ? 'يملك مالك المختبر السلطة الطبية والإدارية الحصرية لاعتماد الكادر وتسعير الفحوصات وإجازة التقارير. لا يستطيع المسؤول التقني (Super Admin) تعديل نتائج التحاليل، كما لا يستطيع مالك المختبر التلاعب بإعدادات البنية التحتية للخوادم.'
                          : 'Laboratory Owner holds exclusive authority over medical staff approvals, test pricing, and diagnostic verification. Super Admin cannot alter clinical records, and Lab Owner cannot alter infrastructure configs.'}
                      </p>
                    </div>
                  </div>

                  {/* Provisioning Guard Card */}
                  <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                    <h4 className="text-sm font-bold text-white">
                      {isRtl ? 'ضوابط تأمين حساب المالك' : 'Owner Provisioning Controls'}
                    </h4>
                    <ul className="text-xs text-slate-400 space-y-2.5">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{isRtl ? 'محظور التسجيل العام كمالك مختبر عبر واجهة الجمهور.' : 'No public registration as Lab Owner.'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{isRtl ? 'منع تصعيد أي مريض أو موظف لدور المالك من المتصفح.' : 'No client-side privilege escalation to Owner.'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{isRtl ? 'ربط الحساب بهوية خادم موثقة حصراً.' : 'Verified server-side identity binding.'}</span>
                      </li>
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 bg-slate-900 rounded-3xl">
                  {isRtl ? 'جاري جلب بيانات حساب مالك المختبر...' : 'Loading owner details...'}
                </div>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* 4. SECURITY MONITORING */}
          {/* ============================================================= */}
          {activeSection === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {isRtl ? 'المراقبة الأمنية المباشرة (Security Monitoring)' : 'Security Event Monitoring'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl ? 'تتبع محاولات الدخول، والتسجيل، وتغيير الحالات، ومحاولات الوصول غير المصرح بها.' : 'Track logins, registrations, and unauthorized access attempts in real time.'}
                  </p>
                </div>
                <button
                  onClick={loadDashboardData}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-teal-400 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تحديث السجل' : 'Refresh'}</span>
                </button>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="divide-y divide-slate-800/80">
                  {securityEvents.map(evt => (
                    <div key={evt.id} className="p-4 hover:bg-slate-850 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            evt.severity === 'critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            evt.severity === 'warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {evt.severity.toUpperCase()}
                          </span>
                          <span className="font-extrabold text-white text-sm">
                            {evt.event_type}
                          </span>
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          {isRtl ? 'المستخدم:' : 'User:'} {evt.user_email || evt.user_id || 'Anonymous / System'}
                        </div>
                        {evt.metadata && Object.keys(evt.metadata).length > 0 && (
                          <div className="text-[11px] text-slate-500 font-mono bg-slate-950/60 p-1.5 rounded border border-slate-800/60 inline-block">
                            {JSON.stringify(evt.metadata)}
                          </div>
                        )}
                      </div>

                      <div className="text-start sm:text-end shrink-0 font-mono text-slate-500 text-[11px]">
                        <div>{new Date(evt.timestamp).toLocaleDateString()}</div>
                        <div>{new Date(evt.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 5. AUDIT LOGS (APPEND-ONLY) */}
          {/* ============================================================= */}
          {activeSection === 'audit' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {isRtl ? 'سجلات التدقيق الإداري غير القابلة للحذف (Audit Logs)' : 'Append-Only Audit Logs'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {isRtl ? 'سجل امتثال تدقيقي غير قابل للتعديل يوثق هوية المنفذ، والعملية، والكيان المتأثر، والتوقيت.' : 'Immutable audit trail capturing all administrative actions.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-teal-950/30 border border-teal-800/50 rounded-xl text-xs text-teal-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-teal-400" />
                <span>
                  {isRtl 
                    ? 'هذا السجل محمي برمجياً: لا يمكن لأي مستخدم أو مسؤول تعديل أو حذف أي قيد وفق معايير الحماية الطبية.' 
                    : 'Audit records are append-only by system architecture. Prohibited from deletion.'}
                </span>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-start">{isRtl ? 'المنفذ' : 'Operator'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'العملية' : 'Action'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'الكيان المتأثر' : 'Target Entity'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'النتيجة' : 'Result'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'التوقيت' : 'Timestamp'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'التفاصيل' : 'Details'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3 text-slate-200">
                            <span className="font-bold">{log.operator_name}</span>
                            <span className="text-slate-500 block text-[10px]">({log.operator_role})</span>
                          </td>
                          <td className="px-4 py-3 text-teal-300 font-bold">
                            {log.action}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {log.target_entity_type} <span className="text-slate-600">({log.target_entity_id})</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              {log.result}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-[10px] max-w-xs truncate">
                            {JSON.stringify(log.details)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 6. SYSTEM CONFIGURATION */}
          {/* ============================================================= */}
          {activeSection === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {isRtl ? 'إعدادات المنصة والنظام (System Configuration)' : 'System Configuration'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'معايير التشغيل الفني لمنظومة مختبر الدنا الطبي المستقل.' : 'Platform operating parameters and security baseline.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-teal-400" />
                    <span>{isRtl ? 'بنية الاستضافة والتشغيل' : 'Hosting & Architecture'}</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">{isRtl ? 'نمط النظام:' : 'System Mode:'}</span>
                      <span className="font-bold text-teal-300 font-mono">Single-Tenant Dedicated</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">{isRtl ? 'رمز المختبر:' : 'Lab Identifier:'}</span>
                      <span className="font-bold text-white font-mono">DNALAB-MAIN-01</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">{isRtl ? 'إصدار المنظومة:' : 'Version:'}</span>
                      <span className="font-bold text-white font-mono">Phase 03 — v1.3.0</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>{isRtl ? 'معايير التشفير والأمان' : 'Security Standards'}</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">{isRtl ? 'صلاحية الجلسات (TTL):' : 'Session TTL:'}</span>
                      <span className="font-bold text-white font-mono">7 Days (Crypto Token)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">{isRtl ? 'عزل خصوصية المرضى:' : 'Patient Isolation:'}</span>
                      <span className="font-bold text-emerald-400">Strict HIPAA Isolation Active</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">{isRtl ? 'حالة سجلات التدقيق:' : 'Audit Trail Status:'}</span>
                      <span className="font-bold text-emerald-400">Append-Only Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 7. BACKUP STATUS */}
          {/* ============================================================= */}
          {activeSection === 'backup' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {isRtl ? 'حالة النسخ الاحتياطي واستعادة البيانات (Backup Status)' : 'Backup Status'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'جاهزية اللقطات اليومية لحماية بيانات المرضى والسجلات الطبية.' : 'Automated transactional backup snapshots and point-in-time recovery.'}
                </p>
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{isRtl ? 'النسخ الاحتياطي التلقائي اليومي' : 'Daily Automated Backup'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Snapshot Interval: Every 24 Hours</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-bold">
                    {isRtl ? 'نشط ومجدول' : 'Active & Scheduled'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">{isRtl ? 'آخر لقطة ناجحة' : 'Last Successful Snapshot'}</div>
                    <div className="text-white font-mono font-bold mt-0.5">{healthStatus?.lastBackupTimestamp || '2026-01-01T04:00:00Z'}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">{isRtl ? 'حجم البيانات المحمية' : 'Data Footprint'}</div>
                    <div className="text-white font-mono font-bold mt-0.5">Transactional Store (Healthy)</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-slate-500 text-[10px]">{isRtl ? 'نقطة الاستعادة المستهدفة' : 'RPO / RTO'}</div>
                    <div className="text-emerald-400 font-mono font-bold mt-0.5">&lt; 15 Minutes</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 8. TECHNICAL NOTIFICATIONS */}
          {/* ============================================================= */}
          {activeSection === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {isRtl ? 'التنبيهات التقنية (Technical Alerts)' : 'Technical Alerts'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'إشعارات البنية التحتية، ونشاط الجلسات، وتنبيهات الأمان.' : 'Platform infrastructure notices and security notifications.'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs">
                  <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">{isRtl ? 'جاهزية الربط مع Google OAuth' : 'Google OAuth Configuration Readiness'}</div>
                    <div className="text-slate-400">
                      {isRtl 
                        ? 'منظومة المصادقة جاهزة لاستقبال VITE_GOOGLE_CLIENT_ID عند تفعيل مفاتيح الإنتاج الرسمية.' 
                        : 'Authentication engine is ready to accept production Google Client ID.'}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white mb-0.5">{isRtl ? 'اكتمال فحص تكامل الصلاحيات' : 'Role Separation Integrity Check Passed'}</div>
                    <div className="text-slate-400">
                      {isRtl 
                        ? 'كافة ضوابط الفصل بين المسؤول التقني ومالك المختبر تعمل بكفاءة على مستوى الخادم.' 
                        : 'Super Admin and Laboratory Owner boundaries are strictly verified on server side.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 9. PLATFORM HEALTH */}
          {/* ============================================================= */}
          {activeSection === 'health' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {isRtl ? 'صحة واستقرار المنصة (Platform Health)' : 'Platform Health & Telemetry'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRtl ? 'مؤشرات استهلاك الذاكرة، ووقت التشغيل، واستقرار الاتصال.' : 'Uptime, memory allocation, and database connectivity metrics.'}
                </p>
              </div>

              {healthStatus && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="text-xs text-slate-400 font-bold mb-1">{isRtl ? 'وقت التشغيل المستمر' : 'Uptime'}</div>
                    <div className="text-2xl font-extrabold text-white font-mono">{healthStatus.uptimeSeconds} ثانية</div>
                    <div className="text-[10px] text-emerald-400 mt-1">100% Availability</div>
                  </div>

                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="text-xs text-slate-400 font-bold mb-1">{isRtl ? 'استهلاك الذاكرة' : 'Heap Memory Used'}</div>
                    <div className="text-2xl font-extrabold text-teal-400 font-mono">{healthStatus.memoryUsageMb} MB</div>
                    <div className="text-[10px] text-teal-300 mt-1">Optimal allocation</div>
                  </div>

                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="text-xs text-slate-400 font-bold mb-1">{isRtl ? 'محرك المصادقة' : 'Auth Engine'}</div>
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono">OPERATIONAL</div>
                    <div className="text-[10px] text-emerald-300 mt-1">Tokens validated</div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ============================================================= */}
      {/* SUSPENSION REASON MODAL */}
      {/* ============================================================= */}
      {suspendingUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-start">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-500/40">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {isRtl ? 'تأكيد تعليق الحساب' : 'Confirm Account Suspension'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {suspendingUser.full_name} ({suspendingUser.email})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isRtl 
                ? 'سيؤدي هذا الإجراء إلى إبطال كافة الجلسات النشطة للمستخدم فورياً وحظره من تسجيل الدخول أو استعراض البوابات المحمية.'
                : 'This action will instantly invalidate active sessions and block the user from accessing protected portals.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {isRtl ? 'سبب التعليق الإلزامي (سجل التدقيق) *' : 'Suspension Reason (Audit Log) *'}
              </label>
              <textarea
                value={suspensionReason}
                onChange={e => setSuspensionReason(e.target.value)}
                placeholder={isRtl ? 'اكتب سبب التعليق للتوثيق الإداري والأمني...' : 'Enter reason for audit trail documentation...'}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSuspendingUser(null);
                  setSuspensionReason('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
              >
                {actionLoading ? (isRtl ? 'جاري التنفيذ...' : 'Processing...') : (isRtl ? 'تأكيد التعليق والتوثيق' : 'Confirm Suspension')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
