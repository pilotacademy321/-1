import React, { useState } from 'react';
import { 
  Activity, 
  Users, 
  ShieldAlert, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  Calendar, 
  Contact, 
  FlaskConical, 
  UserCheck, 
  CheckCircle2, 
  MessageSquare, 
  FileSpreadsheet, 
  Sliders, 
  QrCode, 
  User as UserIcon, 
  CalendarPlus,
  LogOut,
  Globe,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Database
} from 'lucide-react';
import { Language } from '../../types';
import { User, UserRole } from '../../types/auth';
import { ROLE_CONFIG_MAP } from '../../data/navigation';
import { COMMON_STRINGS } from '../../data/translations';
import { useRouter } from '../../router/RouterContext';
import { ModulePlaceholder } from './ModulePlaceholder';
import { PendingApprovalNotice } from '../auth/PendingApprovalNotice';
import { ROLE_DEFINITIONS } from '../../config/permissions';
import { LAB_CONFIG } from '../../config/app.config';
import { StaffApplicationsManager } from '../portals/StaffApplicationsManager';
import { SuperAdminPortal } from '../portals/SuperAdminPortal';
import { LabOwnerPortal } from '../portals/LabOwnerPortal';

interface PortalLayoutProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: User;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Activity,
  Users,
  ShieldAlert,
  FileText,
  Settings,
  LayoutDashboard,
  Calendar,
  Contact,
  FlaskConical,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  FileSpreadsheet,
  Sliders,
  QrCode,
  User: UserIcon,
  CalendarPlus,
};

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  currentLang,
  onLanguageChange,
  currentUser,
}) => {
  const isRtl = currentLang === 'ar';
  const common = COMMON_STRINGS[currentLang];
  const { currentRoute, navigateTo, signOut } = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Phase 03: Dedicated Super Admin Technical Platform Dashboard
  if (currentUser.role === 'super_admin') {
    return (
      <SuperAdminPortal
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        currentUser={currentUser}
      />
    );
  }

  // Phase 03: Dedicated Laboratory Owner Clinical Operations Dashboard
  if (currentUser.role === 'lab_owner') {
    return (
      <LabOwnerPortal
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        currentUser={currentUser}
      />
    );
  }

  const roleConfig = ROLE_CONFIG_MAP[currentUser.role];
  const activeNavItem = roleConfig?.navItems.find(item => item.route === currentRoute) 
    || roleConfig?.navItems[0];

  const permissions = ROLE_DEFINITIONS[currentUser.role]?.allowedActions || [];

  const handleLangToggle = () => {
    onLanguageChange(currentLang === 'ar' ? 'en' : 'ar');
  };

  // If staff is pending approval, render the mandatory approval barrier
  if (currentUser.role === 'staff' && currentUser.staffStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        {/* Minimal Portal Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/dna-laboratory-logo.png" alt="DNA Laboratory" className="h-10 w-auto" />
            <span className="font-bold text-slate-800 text-sm hidden sm:inline">
              {isRtl ? 'بوابة الكادر المخبري' : 'Staff Portal'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLangToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{common.langSwitchLabel}</span>
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{common.signOut}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 flex items-center justify-center">
          <PendingApprovalNotice currentLang={currentLang} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col antialiased">
      
      {/* Top Portal Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo & Portal Info */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                aria-label="Toggle Navigation Sidebar"
              >
                {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                type="button"
                onClick={() => navigateTo('public:home')}
                className="flex items-center gap-3 group focus:outline-none"
                title={common.backToPublic}
              >
                <img 
                  src="/images/dna-laboratory-logo.png" 
                  alt={common.brandName} 
                  className="h-11 w-auto object-contain transition-transform group-hover:scale-105" 
                />
              </button>

              <div className="hidden sm:block border-s border-slate-200 ps-4">
                <div className="text-sm font-extrabold text-slate-900 leading-tight">
                  {roleConfig?.portalTitle[currentLang]}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mt-0.5">
                  <Building2 className="w-3 h-3 text-teal-600" />
                  <span>{LAB_CONFIG.nameArabic} — {LAB_CONFIG.code}</span>
                </div>
              </div>
            </div>

            {/* Right: User identity & Actions */}
            <div className="flex items-center gap-3">
              
              {/* Active User Badge */}
              <div className="hidden md:flex flex-col items-end text-end">
                <span className="text-xs font-bold text-slate-900">
                  {currentUser.displayName}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {roleConfig?.portalBadge[currentLang]}
                </span>
              </div>

              {/* Language Switcher */}
              <button
                onClick={handleLangToggle}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 rounded-xl transition-colors"
                aria-label="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>{common.langSwitchLabel}</span>
              </button>

              {/* Back to Public Web */}
              <button
                onClick={() => navigateTo('public:home')}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
              >
                <span>{common.backToPublic}</span>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                aria-label={common.signOut}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{common.signOut}</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Main Portal Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sticky top-24 space-y-1">
              
              <div className="px-3 py-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                {isRtl ? 'أقسام البوابة المعتمدة' : 'Portal Modules'}
              </div>

              {roleConfig?.navItems.map(item => {
                const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
                const isActive = item.route === currentRoute;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.route as any)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-start group ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-teal-900'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-700'}`} />
                    <span className="flex-1 truncate">{item.label[currentLang]}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
                    <Database className="w-3.5 h-3.5 text-teal-700" />
                    <span>{isRtl ? 'جاهزية قاعدة البيانات:' : 'Database Readiness:'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {isRtl 
                      ? 'مخطط الكيانات والـ Schemas مكتمل وجاهز للربط في المرحلة القادمة.'
                      : 'Schemas and data contracts are staged and ready for provisioning.'}
                  </p>
                </div>
              </div>

            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {mobileSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
              <div className="w-4/5 max-w-sm bg-white h-full p-4 flex flex-col shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="font-extrabold text-sm text-slate-900">
                    {roleConfig?.portalTitle[currentLang]}
                  </div>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1">
                  {roleConfig?.navItems.map(item => {
                    const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
                    const isActive = item.route === currentRoute;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigateTo(item.route as any);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-start ${
                          isActive
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{item.label[currentLang]}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      navigateTo('public:home');
                      setMobileSidebarOpen(false);
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-slate-600 bg-slate-100 rounded-xl mb-2"
                  >
                    {common.backToPublic}
                  </button>
                  <button
                    onClick={signOut}
                    className="w-full py-2.5 text-center text-xs font-bold text-rose-700 bg-rose-50 rounded-xl"
                  >
                    {common.signOut}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Module Content Surface */}
          <main className="lg:col-span-9">
            {activeNavItem?.id === 'owner:staff' ? (
              <StaffApplicationsManager
                currentLang={currentLang}
                currentOwner={currentUser}
              />
            ) : activeNavItem ? (
              <ModulePlaceholder
                currentLang={currentLang}
                moduleCode={activeNavItem.id.toUpperCase()}
                titleArabic={activeNavItem.label.ar}
                titleEnglish={activeNavItem.label.en}
                descriptionArabic={activeNavItem.description?.ar || ''}
                descriptionEnglish={activeNavItem.description?.en || ''}
                primaryEntities={[
                  'DbUser',
                  'DbLaboratorySettings',
                  'DbLaboratoryTest',
                  'DbPatientMedicalRecord',
                  'DbAuditLog',
                ]}
                userRole={currentUser.role}
                allowedActions={permissions}
              />
            ) : null}
          </main>

        </div>
      </div>

    </div>
  );
};
