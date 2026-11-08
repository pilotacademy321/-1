import React from 'react';
import { Clock, ShieldAlert, CheckCircle, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { AUTH_TRANSLATIONS } from '../../data/translations';
import { useRouter } from '../../router/RouterContext';

interface PendingApprovalNoticeProps {
  currentLang: Language;
}

export const PendingApprovalNotice: React.FC<PendingApprovalNoticeProps> = ({ currentLang }) => {
  const isRtl = currentLang === 'ar';
  const t = AUTH_TRANSLATIONS[currentLang];
  const { signOut } = useRouter();

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-3xl border border-amber-200/80 shadow-md p-8 text-center animate-in fade-in duration-300">
      
      {/* Icon Badge */}
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
        <Clock className="w-8 h-8 animate-pulse" />
      </div>

      <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-4">
        {isRtl ? 'حالة الحساب: قيد مراجعة الإدارة (Pending Approval)' : 'Account Status: Pending Owner Approval'}
      </span>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
        {t.staffPendingSuccessMessage}
      </h2>

      <p className="text-slate-600 text-base leading-relaxed max-w-lg mx-auto mb-8 font-medium">
        {t.staffPendingDesc}
      </p>

      {/* Security Architectural Explanations */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-start space-y-3 mb-8">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-800">
              {isRtl ? 'قاعدة الأمان المخبري الصارمة (RBAC Constraint):' : 'Laboratory Security Rule (RBAC Constraint):'}
            </div>
            <div className="text-xs text-slate-600 mt-0.5 font-medium">
              {isRtl
                ? 'لا يُسمح لأي كادر مخبري بالاطلاع على العينات أو إدخال نتائج التحاليل الطبية إلا بعد مراجعة الترخيص الطبي واعتماده رسمياً من قِبل مالك المختبر.'
                : 'Medical staff cannot view clinical samples or submit laboratory results until credentials and licenses are reviewed and approved by the Laboratory Owner.'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-slate-200/60">
          <FileText className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-800">
              {isRtl ? 'سجل الطلب المرفوع:' : 'Submitted Application Reference:'}
            </div>
            <div className="text-xs font-mono text-slate-600 mt-0.5">
              Ref: DNA-STF-APP-2026-0089 | Status: PENDING_OWNER_REVIEW
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={signOut}
          className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors"
        >
          {isRtl ? 'تسجيل الخروج والعودة' : 'Sign Out'}
        </button>
      </div>

    </div>
  );
};
