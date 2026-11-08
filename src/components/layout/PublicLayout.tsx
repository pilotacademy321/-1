import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Lock, 
  Users, 
  FileCheck2, 
  Building2, 
  Layers, 
  ChevronDown, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  FlaskConical,
  Activity,
  FileCode2
} from 'lucide-react';
import { Language } from '../../types';
import { Header } from '../Header';
import { Hero } from '../Hero';
import { COMMON_STRINGS } from '../../data/translations';
import { PLANNED_MODULES, LAB_CONFIG } from '../../config/app.config';
import { ROLE_DEFINITIONS } from '../../config/permissions';
import { useRouter } from '../../router/RouterContext';

interface PublicLayoutProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ currentLang, onLanguageChange }) => {
  const isRtl = currentLang === 'ar';
  const common = COMMON_STRINGS[currentLang];
  const { openAuthModal, signInAsRole } = useRouter();
  const [activeTab, setActiveTab] = useState<'modules' | 'roles' | 'security'>('modules');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Official Header */}
      <Header currentLang={currentLang} onLanguageChange={onLanguageChange} />

      {/* Official Phase 00 Hero with exact background & DNA Double Helix */}
      <main className="flex-1">
        <Hero currentLang={currentLang} />

        {/* Phase 01 Architectural Foundation Showcase */}
        <section className="py-16 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Badge & Title */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-bold mb-4 shadow-xs">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>{common.singleTenantNotice}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {isRtl ? 'الهيكلية التقنية والبنية التحتية لمنظومة مختبر الدنا' : 'Technical Architecture & Infrastructure Foundation'}
              </h2>
              
              <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
                {isRtl 
                  ? 'تم تصميم وبناء الأساس البرمجي للمرحلة 01 وفق معايير الحماية الطبية وعزل الصلاحيات، لدعم 17 وحدة وظيفية وأربعة أدوار مستخدمين رئيسية.'
                  : 'Engineered in Phase 01 according to clinical data protection standards, supporting 17 planned functional modules and 4 distinct role hierarchies.'}
              </p>

              {/* Tabs switcher */}
              <div className="flex items-center justify-center gap-2 mt-8 p-1.5 bg-slate-100/80 rounded-2xl max-w-md mx-auto">
                <button
                  onClick={() => setActiveTab('modules')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'modules'
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isRtl ? 'الوحدات المخططة (17)' : 'Planned Modules (17)'}
                </button>
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'roles'
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isRtl ? 'أدوار النظام (4)' : 'User Roles (4)'}
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'security'
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isRtl ? 'الأمان والخصوصية' : 'Security & Privacy'}
                </button>
              </div>
            </div>

            {/* Tab 1: 17 Planned Modules */}
            {activeTab === 'modules' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-300">
                {PLANNED_MODULES.map(module => (
                  <div 
                    key={module.id}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-teal-300 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-teal-100/80 text-teal-900 font-mono text-xs font-bold">
                          {module.code}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {module.phaseScheduled}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 mb-1.5">
                        {isRtl ? module.titleArabic : module.titleEnglish}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                        {isRtl ? module.descriptionArabic : module.descriptionEnglish}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60">
                      <div className="text-[11px] font-bold text-slate-400 mb-1">
                        {isRtl ? 'الكيانات المجهزة:' : 'Primary Schemas:'}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {module.primaryEntities.slice(0, 2).map(e => (
                          <span key={e} className="text-[10px] font-mono px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: 4 User Roles Foundation */}
            {activeTab === 'roles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                {/* 1. Super Admin */}
                <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold uppercase">
                      Role 1: Super Admin
                    </span>
                    <button
                      onClick={() => signInAsRole('super_admin')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                    >
                      {isRtl ? 'معاينة البوابة' : 'Preview Portal'}
                    </button>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                    {isRtl ? 'المسؤول التقني للمنظومة' : 'Technical Platform Administrator'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                    {isRtl ? ROLE_DEFINITIONS.super_admin.descriptionArabic : ROLE_DEFINITIONS.super_admin.descriptionEnglish}
                  </p>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-medium">
                    <div className="font-bold mb-0.5">
                      {isRtl ? 'قيد الخصوصية الطبية (HIPAA Separation):' : 'Medical Privacy Boundary:'}
                    </div>
                    {isRtl 
                      ? 'المسؤول التقني معزول تلقائياً عن الاطلاع على السجلات والنتائج الطبية الخاصة بالمرضى.' 
                      : 'Super Admin is technically separated from patient clinical files without explicit audit.'}
                  </div>
                </div>

                {/* 2. Laboratory Owner */}
                <div className="p-6 rounded-3xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold uppercase">
                      Role 2: Laboratory Owner
                    </span>
                    <button
                      onClick={() => signInAsRole('lab_owner')}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
                    >
                      {isRtl ? 'معاينة البوابة' : 'Preview Portal'}
                    </button>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                    {isRtl ? 'مالك ومدير المختبر الطبي' : 'Laboratory Owner & Medical Director'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                    {isRtl ? ROLE_DEFINITIONS.lab_owner.descriptionArabic : ROLE_DEFINITIONS.lab_owner.descriptionEnglish}
                  </p>
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
                    {isRtl 
                      ? 'صلاحيات إدارية وطبية عليا: اعتماد الكادر، تسعير الفحوصات، ومراجعة والاعتماد النهائي للنتائج.' 
                      : 'Highest lab authority: staff approvals, test pricing, and final diagnostic sign-offs.'}
                  </div>
                </div>

                {/* 3. Staff */}
                <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase">
                      Role 3: Medical Staff
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => signInAsRole('staff', 'pending')}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 underline"
                      >
                        {isRtl ? 'معاينة الحساب المعلق' : 'Test Pending'}
                      </button>
                      <button
                        onClick={() => signInAsRole('staff', 'approved')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                      >
                        {isRtl ? 'معاينة الكادر المعتمد' : 'Preview Portal'}
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                    {isRtl ? 'الكادر المخبري والطبي' : 'Certified Laboratory Staff'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                    {isRtl ? ROLE_DEFINITIONS.staff.descriptionArabic : ROLE_DEFINITIONS.staff.descriptionEnglish}
                  </p>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                    <div className="font-bold mb-0.5">
                      {isRtl ? 'شرط الاعتماد الإداري الإلزامي:' : 'Mandatory Approval Condition:'}
                    </div>
                    {isRtl 
                      ? 'تسجيل الكادر يظل في حالة (قيد المراجعة / PENDING) ولا يُمكّن من أي إجراء مخبري حتى موافقة مالك المختبر.' 
                      : 'Staff accounts remain PENDING and cannot access sample handling until explicitly approved by the Lab Owner.'}
                  </div>
                </div>

                {/* 4. Patient */}
                <div className="p-6 rounded-3xl border border-teal-200 bg-teal-50/20 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-extrabold uppercase">
                      Role 4: Patient
                    </span>
                    <button
                      onClick={() => signInAsRole('patient')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                    >
                      {isRtl ? 'معاينة البوابة' : 'Preview Portal'}
                    </button>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                    {isRtl ? 'المراجع / المريض' : 'Patient Portal'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                    {isRtl ? ROLE_DEFINITIONS.patient.descriptionArabic : ROLE_DEFINITIONS.patient.descriptionEnglish}
                  </p>
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 font-medium">
                    {isRtl 
                      ? 'تسجيل فوري مباشر دون الحاجة لاعتماد الإدارة، مع حصر الصلاحيات بالملف الطبي والنتائج الخاصة فقط.' 
                      : 'Direct instant registration without approval, with strict data isolation restricted to own health records.'}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Security & Privacy */}
            {activeTab === 'security' && (
              <div className="bg-slate-50/80 rounded-3xl border border-slate-200 p-8 space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {isRtl ? 'التحقق الخادمي الصارم' : 'Server-Side Authorization'}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {isRtl 
                        ? 'عدم الوثوق بأي دور مرسل من المتصفح مباشرة. كل العمليات تُفحص عبر مطابقة توقيعات وادعاءات أمنية صادرة من الخادم.' 
                        : 'Roles and permissions are never trusted directly from the client; enforced via server-side security claims.'}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {isRtl ? 'عزل بيانات المرضى' : 'Patient Data Isolation'}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {isRtl 
                        ? 'فصل تام للسجلات والنتائج الطبية، حيث يستحيل برمجياً على أي مراجع استعراض سجلات أو نتائج مراجع آخر.' 
                        : 'Complete isolation preventing cross-patient access to medical files, appointments, or diagnostic results.'}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                      <Database className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {isRtl ? 'سجلات التدقيق غير القابلة للتعديل' : 'Immutable Audit Trails'}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {isRtl 
                        ? 'توثيق دقيق لكل عملية استعراض أو تعديل للسجلات الطبية ونتائج التحاليل مع إحداثيات الوقت وهوية المستخدم.' 
                        : 'Every read and write operation on clinical records is captured in immutable audit logs.'}
                    </p>
                  </div>

                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={openAuthModal}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    <span>{isRtl ? 'فتح نافذة اختبار الصلاحيات والمصادقة' : 'Open Authentication & Roles Sandbox'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* Official Foundation Footer Bar */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <img 
              src="/images/dna-laboratory-logo.png" 
              alt={common.altLogo} 
              className="h-9 w-auto object-contain"
            />
            <div>
              <span className="font-bold text-slate-800 block">
                {currentLang === 'ar' ? 'مختبر الدنا الطبي — مختبر تشخيصي وطبي معتمد' : 'DNA Medical Diagnostic Laboratory'}
              </span>
              <span className="text-[11px] text-slate-400">
                {currentLang === 'ar' ? 'نظام مخصص لمختبر واحد فقط — Single Laboratory Architecture' : 'Dedicated Single Laboratory Operating System'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>{common.architectureBadge}</span>
            <span>•</span>
            <button 
              onClick={openAuthModal}
              className="text-teal-700 font-bold hover:underline"
            >
              {common.signIn}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
