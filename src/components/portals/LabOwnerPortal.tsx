/**
 * DNA Laboratory - Laboratory Owner Dashboard
 * Phase 03: Super Admin & Laboratory Owner Management System
 */

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Users, 
  Calendar, 
  ClipboardList, 
  FlaskConical, 
  FileCheck2, 
  MessageSquare, 
  FileSpreadsheet, 
  DollarSign, 
  Settings, 
  Bell, 
  History, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Language } from '../../types';
import { User } from '../../types/auth';
import { useRouter } from '../../router/RouterContext';
import { adminClient } from '../../services/adminClient';
import { StaffApplicationsManager } from './StaffApplicationsManager';
import { DbAuditLogRecord } from '../../server/db';

interface LabOwnerPortalProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User;
}

type OwnerSection = 
  | 'overview' 
  | 'appointments' 
  | 'patients' 
  | 'catalog' 
  | 'staff' 
  | 'results' 
  | 'messages' 
  | 'reports' 
  | 'financial' 
  | 'settings' 
  | 'notifications' 
  | 'audit';

export const LabOwnerPortal: React.FC<LabOwnerPortalProps> = ({
  currentLang,
  onLanguageChange,
  currentUser,
}) => {
  const isRtl = currentLang === 'ar';
  const { signOut } = useRouter();

  const [activeSection, setActiveSection] = useState<OwnerSection>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [overviewData, setOverviewData] = useState<{
    certifiedStaffCount: number;
    pendingApplicationsCount: number;
    registeredPatientsCount: number;
    auditHistoryCount: number;
    recentApplications: any[];
  } | null>(null);

  const [auditLogs, setAuditLogs] = useState<DbAuditLogRecord[]>([]);

  const loadOwnerData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const [overview, audits] = await Promise.all([
        adminClient.getLaboratoryOwnerOverview(currentUser.id),
        adminClient.getOwnerAuditLogs(currentUser.id),
      ]);

      setOverviewData(overview);
      setAuditLogs(audits);
    } catch (err: any) {
      setError(err.message || 'Failed to load laboratory owner portal data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, [currentUser.id]);

  const navItems: { id: OwnerSection; labelAr: string; labelEn: string; icon: React.ReactNode; phaseBadge?: string }[] = [
    { id: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: <Crown className="w-4 h-4" /> },
    { id: 'appointments', labelAr: 'المواعيد والحجوزات', labelEn: 'Appointments', icon: <Calendar className="w-4 h-4" />, phaseBadge: 'Phase 04' },
    { id: 'patients', labelAr: 'سجلات المرضى', labelEn: 'Patient Records', icon: <ClipboardList className="w-4 h-4" />, phaseBadge: 'Phase 04' },
    { id: 'catalog', labelAr: 'دليل التحاليل والأسعار', labelEn: 'Laboratory Tests', icon: <FlaskConical className="w-4 h-4" />, phaseBadge: 'Phase 04' },
    { id: 'staff', labelAr: 'إدارة واعتماد الكادر', labelEn: 'Staff Management', icon: <Users className="w-4 h-4" /> },
    { id: 'results', labelAr: 'النتائج والاعتماد النهائي', labelEn: 'Test Results', icon: <FileCheck2 className="w-4 h-4" />, phaseBadge: 'Phase 05' },
    { id: 'messages', labelAr: 'المحادثات الطبية', labelEn: 'Messages', icon: <MessageSquare className="w-4 h-4" />, phaseBadge: 'Phase 05' },
    { id: 'reports', labelAr: 'التقارير الطبية', labelEn: 'Medical Reports', icon: <FileSpreadsheet className="w-4 h-4" />, phaseBadge: 'Phase 05' },
    { id: 'financial', labelAr: 'التقارير المالية', labelEn: 'Financial Reports', icon: <DollarSign className="w-4 h-4" />, phaseBadge: 'Phase 05' },
    { id: 'settings', labelAr: 'إعدادات المختبر', labelEn: 'Laboratory Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'notifications', labelAr: 'الإشعارات والتنبيهات', labelEn: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'audit', labelAr: 'سجل تدقيق المختبر', labelEn: 'Audit History', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Top Clinical Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src="/images/dna-laboratory-logo.png" 
            alt="DNA Laboratory" 
            className="h-10 w-auto object-contain"
          />
          <div className="border-s border-slate-200 ps-3">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900">
                {isRtl ? 'لوحة تحكم صاحب المختبر' : 'Laboratory Owner Dashboard'}
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                {isRtl ? 'الإدارة الطبية العليا' : 'Medical Director'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {currentUser.displayName} — {isRtl ? 'مختبر الدنا الطبي (DNALAB-MAIN)' : 'DNA Laboratory'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onLanguageChange(isRtl ? 'en' : 'ar')}
            className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            {isRtl ? 'English' : 'العربية'}
          </button>

          <button
            onClick={loadOwnerData}
            disabled={refreshing}
            className="p-1.5 text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            title={isRtl ? 'تحديث البيانات' : 'Refresh Data'}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar (12 Items) */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-e border-slate-200 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mb-1">
              {isRtl ? 'أقسام الإدارة المخبرية' : 'Laboratory Navigation'}
            </div>

            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{isRtl ? item.labelAr : item.labelEn}</span>
                  </div>

                  {item.phaseBadge ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                      {item.phaseBadge}
                    </span>
                  ) : (
                    isRtl ? <ChevronLeft className="w-3.5 h-3.5 opacity-40" /> : <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Operational Lab Notice */}
          <div className="mt-6 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-800">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'سلطة الاعتماد المخبري' : 'Laboratory Governance'}</span>
            </div>
            <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
              {isRtl 
                ? 'السلطة الطبية العليا الحصرية لاعتماد الكادر وتسعير الفحوصات والاعتماد النهائي للنتائج.' 
                : 'Highest authority for staff onboarding, diagnostic pricing, and final result verification.'}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900">✕</button>
            </div>
          )}

          {/* ============================================================= */}
          {/* 1. OVERVIEW SECTION */}
          {/* ============================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {isRtl ? 'نظرة عامة على تشغيل المختبر' : 'Laboratory Operations Overview'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl 
                    ? 'المؤشرات التشغيلية ونشاط الكادر الطبي لمختبر الدنا الطبي.' 
                    : 'Operational metrics and staff review queue for DNA Laboratory.'}
                </p>
              </div>

              {/* Clinical Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'الكادر المعتمد النشط' : 'Active Certified Staff'}</span>
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">
                    {overviewData?.certifiedStaffCount ?? '...'}
                  </div>
                  <div className="text-[10px] text-indigo-600 mt-1 font-semibold">
                    {isRtl ? 'أخصائيين وفنيين معتمدين' : 'Certified specialists'}
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'طلبات الكادر قيد الاعتماد' : 'Pending Staff Applications'}</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-600 font-mono">
                    {overviewData?.pendingApplicationsCount ?? '...'}
                  </div>
                  <div className="text-[10px] text-amber-600 mt-1 font-semibold">
                    {isRtl ? 'تنتظر قرار المالك' : 'Awaiting review'}
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'سجلات المرضى المسجلين' : 'Registered Patients'}</span>
                    <ClipboardList className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">
                    {overviewData?.registeredPatientsCount ?? '...'}
                  </div>
                  <div className="text-[10px] text-teal-600 mt-1 font-semibold">
                    {isRtl ? 'ملفات طبية مسجلة' : 'Active patient files'}
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold">{isRtl ? 'العمليات الموثقة في السجل' : 'Audit Trail Logs'}</span>
                    <History className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">
                    {overviewData?.auditHistoryCount ?? '...'}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-1 font-semibold">
                    {isRtl ? 'سجلات تدقيق معتمدة' : 'Immutable audit logs'}
                  </div>
                </div>

              </div>

              {/* Action banner: review pending staff */}
              {overviewData && overviewData.pendingApplicationsCount > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isRtl 
                          ? `لديك ${overviewData.pendingApplicationsCount} طلب انضمام كادر مخبري بحاجة لمراجعتك واعتمادك.` 
                          : `You have ${overviewData.pendingApplicationsCount} pending staff applications requiring your approval.`}
                      </h4>
                      <p className="text-xs text-amber-800 font-medium">
                        {isRtl ? 'لا يستطيع الكادر الوصول لمهام الفحص قبل موافقتك الرسمية.' : 'Staff members are strictly blocked until your official approval.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSection('staff')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
                  >
                    {isRtl ? 'مراجعة الطلبات الآن' : 'Review Applications'}
                  </button>
                </div>
              )}

              {/* Operational Guidelines Box */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>{isRtl ? 'سياسة الحوكمة والتشغيل المخبري لمختبر الدنا' : 'Laboratory Governance Policy'}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isRtl 
                    ? 'يتم تشغيل مختبر الدنا كنظام مخصص لمختبر فردي تشخيصي مستقل. تشمل صلاحيات المالك: اعتماد التراخيص الطبية للعاملين، ضبط سياسات التسعير، ومراجعة والاعتماد النهائي للنتائج والتقارير الطبية قبل إرسالها للمرضى.'
                    : 'DNA Laboratory operates as a single-tenant clinical diagnostic facility. Owner authorities include verifying healthcare credentials, setting clinical pricing, and providing final diagnostic report authorizations.'}
                </p>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 5. STAFF MANAGEMENT (Interactive) */}
          {/* ============================================================= */}
          {activeSection === 'staff' && (
            <div className="animate-in fade-in duration-200">
              <StaffApplicationsManager 
                currentLang={currentLang}
                currentOwner={currentUser}
              />
            </div>
          )}

          {/* ============================================================= */}
          {/* 10. LABORATORY SETTINGS */}
          {/* ============================================================= */}
          {activeSection === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {isRtl ? 'إعدادات وسياسات المختبر' : 'Laboratory Settings & Policies'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl ? 'المعلومات التشغيلية والترخيص المعتمد لمختبر الدنا الطبي.' : 'Official laboratory metadata and operating schedule.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>{isRtl ? 'بيانات المنشأة الطبية' : 'Clinical Facility Info'}</span>
                  </h3>
                  <div className="space-y-2.5 text-xs font-medium">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">{isRtl ? 'الاسم الرسمي:' : 'Official Name:'}</span>
                      <span className="font-bold text-slate-900">مختبر الدنا الطبي — DNA Laboratory</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">{isRtl ? 'رقم الترخيص الصحي:' : 'License Number:'}</span>
                      <span className="font-mono font-bold text-slate-900">MOH-LAB-2026-9941</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">{isRtl ? 'المدير الطبي:' : 'Medical Director:'}</span>
                      <span className="font-bold text-indigo-700">{currentUser.displayName}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? 'أوقات العمل واستقبال العينات' : 'Operating Hours'}</span>
                  </h3>
                  <div className="space-y-2.5 text-xs font-medium">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">{isRtl ? 'أيام العمل:' : 'Work Days:'}</span>
                      <span className="font-bold text-slate-900">{isRtl ? 'السبت - الخميس' : 'Saturday - Thursday'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">{isRtl ? 'ساعات الاستقبال:' : 'Hours:'}</span>
                      <span className="font-bold text-slate-900">07:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">{isRtl ? 'خدمة الطوارئ:' : 'Emergency Testing:'}</span>
                      <span className="font-bold text-emerald-600">{isRtl ? 'متاحة 24/7' : 'Available 24/7'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 11. NOTIFICATIONS */}
          {/* ============================================================= */}
          {activeSection === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {isRtl ? 'الإشعارات والتنبيهات الإدارية' : 'Administrative Notifications'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl ? 'تنبيهات فورية لطلبات انضمام الكادر ومستجدات المختبر.' : 'Alerts regarding staff onboarding and laboratory updates.'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 mb-0.5">
                      {isRtl ? 'اكتمال تأسيس منظومة المصادقة والصلاحيات (Phase 02 & 03)' : 'Role Architecture Fully Implemented'}
                    </div>
                    <div className="text-slate-600">
                      {isRtl 
                        ? 'تم تثبيت سلطة مالك المختبر كمرجع حصري لاعتماد الكادر الطبي والمخبري بنجاح.' 
                        : 'Laboratory Owner authority as exclusive staff approval body is active and enforced.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* 12. AUDIT HISTORY */}
          {/* ============================================================= */}
          {activeSection === 'audit' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {isRtl ? 'سجل التدقيق الإداري للمختبر' : 'Laboratory Audit History'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isRtl ? 'سجل القرارات والعمليات الإدارية المعتمدة لمالك المختبر.' : 'Operational decisions and staff approval history.'}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-start">{isRtl ? 'العملية' : 'Action'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'المنفذ' : 'Operator'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'النتيجة' : 'Result'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'التوقيت' : 'Timestamp'}</th>
                        <th className="px-4 py-3 text-start">{isRtl ? 'البيانات' : 'Details'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-indigo-700 font-bold">
                            {log.action}
                          </td>
                          <td className="px-4 py-3 text-slate-800">
                            {log.operator_name}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {log.result}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-[10px] max-w-xs truncate">
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
          {/* UNFINISHED MODULES (Clearly Stated Implementation Status) */}
          {/* ============================================================= */}
          {['appointments', 'patients', 'catalog', 'results', 'messages', 'reports', 'financial'].includes(activeSection) && (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 animate-in fade-in duration-200 max-w-2xl mx-auto my-12">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {isRtl ? 'حالة الوحدة: مجدولة للمراحل القادمة' : 'Module Implementation Status'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isRtl 
                  ? `هذه الوحدة (${navItems.find(i => i.id === activeSection)?.labelAr}) مجهزة ومعرفة في مخططات قاعدة البيانات (Schemas & RBAC) ومجدولة للتنفيذ البرمجي في المرحلة المخصصة لها (المرحلة 04 / 05) وفق المخطط الهندسي للمشروع، ولم يتم إنشاء واجهات وهمية لها للحفاظ على نزاهة وموثوقية النظام.`
                  : `This module (${navItems.find(i => i.id === activeSection)?.labelEn}) is architected in database schemas and scheduled for full development in its designated phase (Phase 04 / 05). Fake mock functionalities are strictly avoided.`}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveSection('overview')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {isRtl ? 'العودة للوحة القيادة' : 'Back to Overview'}
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
