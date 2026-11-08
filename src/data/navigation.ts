import { RoleNavigationConfig, PortalNavItem } from '../types/navigation';

export const SUPER_ADMIN_NAV: RoleNavigationConfig = {
  role: 'super_admin',
  portalTitle: {
    ar: 'بوابة الإدارة والرقابة التقنية',
    en: 'Technical Administration Portal',
  },
  portalBadge: {
    ar: 'المسؤول التقني للمنظومة',
    en: 'System Super Admin',
  },
  navItems: [
    {
      id: 'admin:overview',
      route: 'admin:overview',
      icon: 'Activity',
      label: { ar: 'نظرة عامة على النظام', en: 'System Overview' },
      description: { ar: 'مراقبة حالة السيرفرات والموارد التقنية', en: 'Server infrastructure and system health' },
    },
    {
      id: 'admin:users',
      route: 'admin:users',
      icon: 'Users',
      label: { ar: 'إدارة الحسابات التقنية', en: 'User Management' },
      description: { ar: 'الإشراف على هويات المستخدمين وصلاحياتهم', en: 'Identity and technical account oversight' },
    },
    {
      id: 'admin:security',
      route: 'admin:security',
      icon: 'ShieldAlert',
      label: { ar: 'الأمان والامتثال', en: 'Security' },
      description: { ar: 'إعدادات جدران الحماية وسياسات التشفير', en: 'Firewall rules and cryptographic policies' },
    },
    {
      id: 'admin:audit',
      route: 'admin:audit',
      icon: 'FileText',
      label: { ar: 'سجلات التدقيق التقنية', en: 'Audit Logs' },
      description: { ar: 'سجل حركات النظام التقنية وتتبع العمليات', en: 'System mutation and access audit trail' },
    },
    {
      id: 'admin:settings',
      route: 'admin:settings',
      icon: 'Settings',
      label: { ar: 'إعدادات المنظومة', en: 'System Settings' },
      description: { ar: 'النسخ الاحتياطي والتهيئة السحابية', en: 'Cloud environment and disaster recovery' },
    },
  ],
};

export const LAB_OWNER_NAV: RoleNavigationConfig = {
  role: 'lab_owner',
  portalTitle: {
    ar: 'بوابة إدارة مالك المختبر',
    en: 'Laboratory Owner Portal',
  },
  portalBadge: {
    ar: 'الإدارة الطبية العليا للمختبر',
    en: 'Medical Lab Director',
  },
  navItems: [
    {
      id: 'owner:dashboard',
      route: 'owner:dashboard',
      icon: 'LayoutDashboard',
      label: { ar: 'لوحة القيادة', en: 'Dashboard' },
      description: { ar: 'المؤشرات التشغيلية ونشاط المختبر اليومي', en: 'Daily clinical operations & laboratory overview' },
    },
    {
      id: 'owner:appointments',
      route: 'owner:appointments',
      icon: 'Calendar',
      label: { ar: 'المواعيد والحجوزات', en: 'Appointments' },
      description: { ar: 'متابعة مواعيد سحب العينات وجداول المراجعين', en: 'Patient appointments & sampling schedule' },
    },
    {
      id: 'owner:patients',
      route: 'owner:patients',
      icon: 'Contact',
      label: { ar: 'سجلات المرضى', en: 'Patients' },
      description: { ar: 'الملفات الطبية وتاريخ الزيارات المخبرية', en: 'Patient directories and clinical records' },
    },
    {
      id: 'owner:catalog',
      route: 'owner:catalog',
      icon: 'FlaskConical',
      label: { ar: 'دليل التحاليل والأسعار', en: 'Test Catalog' },
      description: { ar: 'قائمة الفحوصات والأسعار وشروط العينات', en: 'Diagnostic tests catalog, pricing & policies' },
    },
    {
      id: 'owner:staff',
      route: 'owner:staff',
      icon: 'UserCheck',
      label: { ar: 'الكادر الطبي والمخبري', en: 'Staff' },
      description: { ar: 'اعتماد طلبات الانضمام وإدارة الصلاحيات', en: 'Staff approvals, licenses & permissions' },
    },
    {
      id: 'owner:results',
      route: 'owner:results',
      icon: 'CheckCircle2',
      label: { ar: 'النتائج والاعتماد النهائي', en: 'Results' },
      description: { ar: 'مراجعة النتائج المخبرية والاعتماد الطبي النهائي', en: 'Clinical result review & final sign-off' },
    },
    {
      id: 'owner:messages',
      route: 'owner:messages',
      icon: 'MessageSquare',
      label: { ar: 'المحادثات والأرشيف', en: 'Messages' },
      description: { ar: 'قنوات التواصل والأرشيف الإداري المحمي', en: 'Patient consultations & protected archive' },
    },
    {
      id: 'owner:reports',
      route: 'owner:reports',
      icon: 'FileSpreadsheet',
      label: { ar: 'التقارير الطبية والإحصائية', en: 'Reports' },
      description: { ar: 'التقارير التشخيصية المعتمدة والإحصاءات', en: 'Diagnostic report generation & analytics' },
    },
    {
      id: 'owner:settings',
      route: 'owner:settings',
      icon: 'Sliders',
      label: { ar: 'إعدادات المختبر', en: 'Settings' },
      description: { ar: 'ساعات العمل، الشعار الرسمي، وسياسة العينات', en: 'Operating hours, policies & letterhead' },
    },
  ],
};

export const STAFF_NAV: RoleNavigationConfig = {
  role: 'staff',
  portalTitle: {
    ar: 'بوابة الكادر الطبي والمخبري',
    en: 'Staff & Laboratory Portal',
  },
  portalBadge: {
    ar: 'كادر مخبري معتمد',
    en: 'Certified Medical Staff',
  },
  navItems: [
    {
      id: 'staff:dashboard',
      route: 'staff:dashboard',
      icon: 'LayoutDashboard',
      label: { ar: 'لوحة المهام المخبرية', en: 'Dashboard' },
      description: { ar: 'قوائم العينات المطلوبة والتحاليل الجارية', en: 'Daily sample queue & diagnostic workflow' },
    },
    {
      id: 'staff:appointments',
      route: 'staff:appointments',
      icon: 'Calendar',
      label: { ar: 'مواعيد الاستقبال والسحب', en: 'Appointments' },
      description: { ar: 'جدول سحب العينات والزيارات المجدولة', en: 'Scheduled phlebotomy & collection queue' },
    },
    {
      id: 'staff:patients',
      route: 'staff:patients',
      icon: 'Users',
      label: { ar: 'ملفات المراجعين', en: 'Patients' },
      description: { ar: 'البحث عن ملفات المرضى وتاريخ التحاليل', en: 'Patient lookup & historical test visits' },
    },
    {
      id: 'staff:tests',
      route: 'staff:tests',
      icon: 'FlaskConical',
      label: { ar: 'دليل الفحوصات', en: 'Tests' },
      description: { ar: 'دليل الفحوصات والمتطلبات والأنبوب المطلوب', en: 'Clinical catalog & sampling criteria' },
    },
    {
      id: 'staff:samples',
      route: 'staff:samples',
      icon: 'QrCode',
      label: { ar: 'إدارة العينات والباركود', en: 'Samples' },
      description: { ar: 'استلام العينات، الترميز والتحقق المخبري', en: 'Sample accessioning & barcode scanning' },
    },
    {
      id: 'staff:results',
      route: 'staff:results',
      icon: 'CheckCircle2',
      label: { ar: 'إدخال النتائج والتدقيق', en: 'Results' },
      description: { ar: 'تسجيل القياسات ومقارنة القيم المرجعية', en: 'Result entry & technician verification' },
    },
    {
      id: 'staff:messages',
      route: 'staff:messages',
      icon: 'MessageSquare',
      label: { ar: 'محادثات الاستفسار', en: 'Messages' },
      description: { ar: 'الرد على استفسارات المراجعين المصرح بها', en: 'Authorized patient inquiries' },
    },
  ],
};

export const PATIENT_NAV: RoleNavigationConfig = {
  role: 'patient',
  portalTitle: {
    ar: 'بوابة المراجع — السجل الطبي',
    en: 'Patient Health Portal',
  },
  portalBadge: {
    ar: 'مراجع مختبر الدنا',
    en: 'DNA Lab Patient',
  },
  navItems: [
    {
      id: 'patient:profile',
      route: 'patient:profile',
      icon: 'User',
      label: { ar: 'ملفي الشخصي', en: 'My Profile' },
      description: { ar: 'البيانات الشخصية ومعلومات الاتصال', en: 'Personal demographics & contact info' },
    },
    {
      id: 'patient:book',
      route: 'patient:book',
      icon: 'CalendarPlus',
      label: { ar: 'حجز موعد فحص', en: 'Book Appointment' },
      description: { ar: 'طلب موعد لسحب العينات في المختبر أو منزلياً', en: 'Request lab or home sampling appointment' },
    },
    {
      id: 'patient:appointments',
      route: 'patient:appointments',
      icon: 'Calendar',
      label: { ar: 'مواعيدي', en: 'My Appointments' },
      description: { ar: 'سجل المواعيد القادمة والسابقة وحالتها', en: 'Upcoming & past scheduled appointments' },
    },
    {
      id: 'patient:records',
      route: 'patient:records',
      icon: 'FileText',
      label: { ar: 'ملفي الطبي وسجل الزيارات', en: 'My Medical File' },
      description: { ar: 'السجل الطبي الدائم والزيارات المخبرية', en: 'Permanent medical record & visit history' },
    },
    {
      id: 'patient:results',
      route: 'patient:results',
      icon: 'CheckCircle2',
      label: { ar: 'نتائجي المخبرية والتقارير', en: 'My Results' },
      description: { ar: 'الاطلاع على النتائج المعتمدة وتحميل التقارير', en: 'Verified diagnostic results & PDF reports' },
    },
    {
      id: 'patient:messages',
      route: 'patient:messages',
      icon: 'MessageSquare',
      label: { ar: 'المحادثات الطبية', en: 'Messages' },
      description: { ar: 'التواصل المباشر مع أخصائيي المختبر', en: 'Direct messaging with laboratory specialists' },
    },
    {
      id: 'patient:settings',
      route: 'patient:settings',
      icon: 'Settings',
      label: { ar: 'إعدادات الحساب والإشعارات', en: 'Settings' },
      description: { ar: 'تفضيلات الإشعار واللغة والأمان', en: 'Notification & privacy preferences' },
    },
  ],
};

export const ROLE_CONFIG_MAP: Record<string, RoleNavigationConfig> = {
  super_admin: SUPER_ADMIN_NAV,
  lab_owner: LAB_OWNER_NAV,
  staff: STAFF_NAV,
  patient: PATIENT_NAV,
};
