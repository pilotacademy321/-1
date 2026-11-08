import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  UserX, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { Language } from '../../types';
import { AUTH_PHASE_02 } from '../../data/translations';
import { authClient } from '../../services/authClient';
import { DbStaffApplicationRecord } from '../../server/db';
import { User } from '../../types/auth';

interface StaffApplicationsManagerProps {
  currentLang: Language;
  currentOwner: User;
}

export const StaffApplicationsManager: React.FC<StaffApplicationsManagerProps> = ({
  currentLang,
  currentOwner,
}) => {
  const isRtl = currentLang === 'ar';
  const t = AUTH_PHASE_02[currentLang];
  const [applications, setApplications] = useState<DbStaffApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await authClient.getStaffApplications(currentOwner.id);
      setApplications(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load staff applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentOwner.id]);

  const handleApprove = async (appId: string, applicantName: string) => {
    try {
      setErrorMessage(null);
      await authClient.approveStaff(currentOwner.id, appId);
      setActionSuccessMessage(
        isRtl 
          ? `تم اعتماد وتفعيل حساب ${applicantName} بنجاح.` 
          : `Staff account for ${applicantName} has been approved and activated.`
      );
      await fetchApplications();
    } catch (err: any) {
      setErrorMessage(err.message || 'Approval operation failed');
    }
  };

  const handleReject = async (appId: string, applicantName: string) => {
    const reason = prompt(t.confirmRejectMsg, isRtl ? 'عدم استيفاء شروط الترخيص الطبي' : 'License criteria not satisfied');
    if (reason === null) return;

    try {
      setErrorMessage(null);
      await authClient.rejectStaff(currentOwner.id, appId, reason);
      setActionSuccessMessage(
        isRtl 
          ? `تم رفض طلب ${applicantName}.` 
          : `Staff application for ${applicantName} has been rejected.`
      );
      await fetchApplications();
    } catch (err: any) {
      setErrorMessage(err.message || 'Rejection operation failed');
    }
  };

  const pendingApps = applications.filter(a => a.application_status === 'pending');
  const reviewedApps = applications.filter(a => a.application_status !== 'pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
            <ShieldCheck className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
              {t.staffManagerTitle}
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
              {t.staffManagerSubtitle}
            </p>
          </div>
        </div>

        {actionSuccessMessage && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs md:text-sm font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs md:text-sm font-semibold text-rose-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Pending Applications Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-extrabold text-slate-900">
              {t.pendingListTitle}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            {pendingApps.length}
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm font-medium">
            {isRtl ? 'جارٍ تحميل طلبات الكادر...' : 'Loading staff applications...'}
          </div>
        ) : pendingApps.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm font-medium">
            {t.noPendingRequests}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingApps.map(app => (
              <div 
                key={app.id}
                className="p-5 rounded-xl border border-amber-200/70 bg-amber-50/20 hover:bg-amber-50/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">
                      {app.full_name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                      {isRtl ? 'قيد المراجعة' : 'PENDING'}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-teal-800">
                    {app.job_title}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {app.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {app.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.city}
                    </span>
                  </div>

                  {app.additional_info && (
                    <div className="text-xs bg-white p-2 rounded-lg border border-slate-200/60 text-slate-700 mt-2 font-medium">
                      <span className="font-bold text-slate-900">{isRtl ? 'الملاحظات والترخيص: ' : 'Credentials: '}</span>
                      {app.additional_info}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleApprove(app.id, app.full_name)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{t.approveBtn}</span>
                  </button>
                  <button
                    onClick={() => handleReject(app.id, app.full_name)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>{t.rejectBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed Applications History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-extrabold text-slate-900">
              {t.reviewedListTitle}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            {reviewedApps.length}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {reviewedApps.map(app => (
            <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {app.full_name} — <span className="text-teal-700 font-semibold">{app.job_title}</span>
                </div>
                <div className="text-slate-500 font-medium mt-0.5">
                  {app.email} • {app.city} • {t.reviewedAtLabel} {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div>
                {app.application_status === 'approved' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.statusApproved}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-bold border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t.statusRejected}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
