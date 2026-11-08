import React from 'react';
import { 
  Database, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  GitBranch, 
  FileCode2, 
  ArrowLeft,
  ArrowRight,
  Lock
} from 'lucide-react';
import { Language } from '../../types';
import { PLANNED_MODULES } from '../../config/app.config';
import { UserRole } from '../../types/auth';

interface ModulePlaceholderProps {
  currentLang: Language;
  moduleCode: string;
  titleArabic: string;
  titleEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
  primaryEntities: string[];
  userRole: UserRole;
  allowedActions: string[];
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({
  currentLang,
  moduleCode,
  titleArabic,
  titleEnglish,
  descriptionArabic,
  descriptionEnglish,
  primaryEntities,
  userRole,
  allowedActions,
}) => {
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Module Staging Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>{moduleCode}</span>
              <span className="text-teal-400">|</span>
              <span>{isRtl ? 'الهيكلية البرمجية المجهزة — المرحلة 01' : 'Phase 01 Architectural Staging'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isRtl ? titleArabic : titleEnglish}
            </h2>
            <p className="text-base text-slate-600 font-medium mt-2 max-w-3xl">
              {isRtl ? descriptionArabic : descriptionEnglish}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-slate-400">
              {isRtl ? 'حالة الربط البرمجي' : 'Integration Status'}
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>{isRtl ? 'جاهز لربط قاعدة البيانات في المرحلة القادمة' : 'Ready for DB Integration in Next Phase'}</span>
            </div>
          </div>
        </div>

        {/* Technical Architecture Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          
          {/* Box 1: Data Model Entities */}
          <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
              <Database className="w-4 h-4 text-teal-700" />
              <span>{isRtl ? 'كيانات قاعدة البيانات المخططة' : 'Planned Database Entities'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {primaryEntities.map(entity => (
                <span 
                  key={entity}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-semibold text-teal-900"
                >
                  {entity}
                </span>
              ))}
            </div>
          </div>

          {/* Box 2: RBAC Security & Permissions */}
          <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isRtl ? 'الصلاحيات المقيدة لهذا الدور' : 'Role Permissions & Access'}</span>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs text-slate-600 font-semibold">
                {isRtl ? 'الدور المعتمد:' : 'Active Role:'}{' '}
                <span className="text-emerald-800 font-bold uppercase">{userRole}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {allowedActions.slice(0, 3).map(action => (
                  <span 
                    key={action}
                    className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-mono"
                  >
                    {action}
                  </span>
                ))}
                {allowedActions.length > 3 && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    +{allowedActions.length - 3} {isRtl ? 'صلاحيات أخرى' : 'more'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Box 3: Architectural Next Step */}
          <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>{isRtl ? 'المواصفات الطبية والهندسية' : 'Clinical & Technical Standards'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {isRtl 
                ? 'تم بناء عقود البيانات وواجهات البرمجة وعزل الصلاحيات وفق أفضل ممارسات المختبرات الطبية الفردية وحماية بيانات المرضى.'
                : 'Data contracts, TypeScript interfaces, and RBAC rules constructed according to ISO/HIPAA medical laboratory safety standards.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
