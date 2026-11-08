import { Language, NavItem, HeroContent } from '../types';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: {
      ar: 'الرئيسية',
      en: 'Home',
    },
    href: '#home',
  },
  {
    id: 'tests',
    label: {
      ar: 'التحاليل الطبية',
      en: 'Laboratory Tests',
    },
    href: '#tests',
  },
  {
    id: 'booking',
    label: {
      ar: 'الحجز الإلكتروني',
      en: 'Online Booking',
    },
    href: '#booking',
  },
  {
    id: 'about',
    label: {
      ar: 'عن المختبر',
      en: 'About Us',
    },
    href: '#about',
  },
  {
    id: 'contact',
    label: {
      ar: 'اتصل بنا',
      en: 'Contact',
    },
    href: '#contact',
  },
];

export const HERO_TRANSLATIONS: Record<Language, HeroContent> = {
  ar: {
    badge: 'مختبر تشخيصي وطبي معتمد',
    title: 'مختبر الدنا',
    subtitle: 'دقة في الفحص، ثقة في النتائج، واهتمام بصحتك.',
    primaryCta: 'احجز موعدك الآن',
    secondaryCta: 'استكشف التحاليل',
    features: [
      { id: 'f1', text: 'أحدث تقنيات الفحص الجيني والمخبري' },
      { id: 'f2', text: 'معايير جودة طبية فائقة الدقة' },
      { id: 'f3', text: 'سرعة وسرية تامة في إصدار النتائج' },
    ],
  },
  en: {
    badge: 'Accredited Clinical & Diagnostic Laboratory',
    title: 'DNA Laboratory',
    subtitle: 'Precision in Testing. Confidence in Results. Care for Your Health.',
    primaryCta: 'Book an Appointment',
    secondaryCta: 'Explore Tests',
    features: [
      { id: 'f1', text: 'Advanced Genetic & Clinical Diagnostics' },
      { id: 'f2', text: 'Rigorous Medical Precision Standards' },
      { id: 'f3', text: 'Fast, Confidential Result Delivery' },
    ],
  },
};

export const COMMON_STRINGS = {
  ar: {
    langSwitchLabel: 'English',
    brandName: 'مختبر الدنا الطبي',
    altLogo: 'شعار مختبر الدنا الطبي',
    altHeroBg: 'الخلفية العلمية لمختبر الدنا - اللولب المزدوج للحمض النووي',
    menuOpen: 'فتح القائمة الرئيسية',
    menuClose: 'إغلاق القائمة',
    tagline: 'الرعاية الطبية والدقة التشخيصية',
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب جديد',
    signOut: 'تسجيل الخروج',
    portalSwitch: 'بوابات النظام',
    backToPublic: 'العودة للبوابة الرئيسية',
    architectureBadge: 'المرحلة 02 — منظومة المصادقة وتسجيل الحسابات',
    singleTenantNotice: 'نظام تشغيلي لمختبر طبي واحد حصراً — DNA Laboratory',
  },
  en: {
    langSwitchLabel: 'العربية',
    brandName: 'DNA Medical Laboratory',
    altLogo: 'DNA Medical Laboratory Official Logo',
    altHeroBg: 'DNA Laboratory Scientific Background - DNA Double Helix',
    menuOpen: 'Open main menu',
    menuClose: 'Close menu',
    tagline: 'Precision Diagnostics & Healthcare',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    signOut: 'Sign Out',
    portalSwitch: 'System Portals',
    backToPublic: 'Back to Public Web',
    architectureBadge: 'Phase 02 — Google Authentication & Registration',
    singleTenantNotice: 'Dedicated Operating System for Single Medical Lab — DNA Laboratory',
  },
} as const;

export const AUTH_PHASE_02 = {
  ar: {
    pageTitle: 'بوابة تسجيل الدخول وإنشاء الحساب',
    pageSubtitle: 'الدخول الموحد الآمن عبر حساب Google لمختبر الدنا الطبي',
    tabSignIn: 'تسجيل الدخول',
    tabSignUp: 'إنشاء حساب جديد',
    googleSignInBtn: 'تسجيل الدخول عبر Google',
    googleSignUpBtn: 'المتابعة والتسجيل عبر Google',
    googleBrandNotice: 'مصادقة موثوقة ومحمية عبر Google Identity Services',
    
    // User type selection (Exact prompt Arabic texts)
    welcomeHeading: 'مرحباً بك في مختبر الدنا',
    welcomeDescription: 'يرجى اختيار نوع الحساب الذي تريد إنشاءه.',
    
    optionPatientTitle: 'مريض',
    optionPatientSubtitle: 'إنشاء حساب فوري لمتابعة المواعيد والسجل الطبي الشخصي والنتائج المخبرية.',
    optionPatientAction: 'تسجيل كـ مريض',
    
    optionStaffTitle: 'موظف',
    optionStaffSubtitle: 'طلب انضمام للكادر الطبي والمخبري (يخضع لمراجعة واعتماد إدارة المختبر).',
    optionStaffAction: 'تسجيل كـ موظف',
    
    // Patient Form
    patientFormTitle: 'استكمال بيانات المراجع / المريض',
    fullNameLabel: 'الاسم الكامل',
    emailLabel: 'البريد الإلكتروني الموثق (Google)',
    phoneLabel: 'رقم الهاتف الجوال',
    dobLabel: 'تاريخ الميلاد (اختياري)',
    genderLabel: 'الجنس (اختياري)',
    genderMale: 'ذكر',
    genderFemale: 'أنثى',
    cityLabel: 'المدينة',
    addressLabel: 'العنوان الوطني أو السكن (اختياري)',
    completePatientBtn: 'إتمام التسجيل والدخول إلى البوابة',
    patientSuccessWelcome: 'مرحباً بك في مختبر الدنا! تم تفعيل حسابك الطبي بنجاح.',
    
    // Staff Form
    staffFormTitle: 'تقديم طلب تسجيل كادر مخبري',
    jobTitleLabel: 'المسمى الوظيفي والتخصص المخبري',
    jobTitlePlaceholder: 'مثال: أخصائي وراثة جزيئية / فني سحب عينات / كيميائي مخبري',
    additionalInfoLabel: 'معلومات إضافية أو رقم الترخيص الصحي (اختياري)',
    additionalInfoPlaceholder: 'بيانات الخبرة، رقم ترخيص الهيئة الصحية، أو ملاحظات',
    submitStaffBtn: 'إرسال طلب التسجيل للاعتماد',
    
    // Staff Pending Notice (Exact prompt Arabic text)
    staffPendingSuccessMessage: 'تم استلام طلب التسجيل بنجاح. حسابك قيد مراجعة إدارة المختبر، وسيتم إشعارك عند الموافقة.',
    staffPendingStatusBadge: 'حالة الحساب: قيد المراجعة والاعتماد (PENDING)',
    staffPendingDesc: 'لا يمكن الوصول لمهام الفحص أو إدخال النتائج أو سجلات المختبر قبل صدور قرار الاعتماد الرسمي من مالك المختبر.',
    
    // Staff Rejected Notice
    staffRejectedTitle: 'حالة طلب الانضمام: مرفوض',
    staffRejectedDesc: 'نعتذر، لم تتم الموافقة على طلب انضمامك للكادر المخبري في الوقت الحالي.',
    rejectionReasonLabel: 'سبب القرار:',
    
    // Staff Approvals Manager (For Laboratory Owner)
    staffManagerTitle: 'إدارة طلبات تسجيل الكادر الطبي والمخبري',
    staffManagerSubtitle: 'صلاحية حصرية لمالك المختبر: مراجعة الكفاءات، الترخيص، واتخاذ قرار الاعتماد أو الرفض.',
    pendingListTitle: 'طلبات الانضمام قيد المراجعة',
    reviewedListTitle: 'سجل القرارات والطلبات السابقة',
    noPendingRequests: 'لا توجد طلبات انضمام معلقة حالياً.',
    approveBtn: 'اعتماد الكادر وتفعيل الحساب',
    rejectBtn: 'رفض الطلب',
    confirmApproveMsg: 'هل أنت متأكد من اعتماد هذا الموظف وتفعيل صلاحياته المخبرية؟',
    confirmRejectMsg: 'يرجى كتابة سبب رفض الطلب:',
    statusApproved: 'معتمد ومفعل',
    statusRejected: 'مرفوض',
    reviewedByLabel: 'اعتمد بواسطة:',
    reviewedAtLabel: 'تاريخ القرار:',
    
    // Sandbox / Test Accounts switcher
    testAccountsTitle: 'الحسابات المعتمدة الجاهزة لمعاينة النظام:',
    testOwnerLabel: 'د. فيصل القحطاني (مالك المختبر)',
    testAdminLabel: 'م. طارق العتيبي (المسؤول التقني)',
    testStaffActiveLabel: 'أ.د. عبد العزيز الشمري (كادر نشط)',
    testPatientLabel: 'سارة عبد الله (مريضة مسجلة)',
    oauthEnvWarning: 'ملاحظة للمطور: لم يتم توفير مفتاح Google Client ID في متغيرات البيئة. تم تفعيل موجه التحقق والمحاكاة الآمنة لاختبار كافة مسارات التسجيل والاعتماد.',
  },
  en: {
    pageTitle: 'Sign In & Account Registration Portal',
    pageSubtitle: 'Unified secure access with Google Identity for DNA Medical Laboratory',
    tabSignIn: 'Sign In',
    tabSignUp: 'Create Account',
    googleSignInBtn: 'Sign In with Google',
    googleSignUpBtn: 'Continue with Google Account',
    googleBrandNotice: 'Protected and verified via Google Identity Services',
    
    // User type selection
    welcomeHeading: 'Welcome to DNA Laboratory',
    welcomeDescription: 'Please select the type of account you want to create.',
    
    optionPatientTitle: 'Patient',
    optionPatientSubtitle: 'Direct registration to manage appointments, personal medical file, and diagnostic results.',
    optionPatientAction: 'Register as Patient',
    
    optionStaffTitle: 'Staff Member',
    optionStaffSubtitle: 'Apply for laboratory clinical staff membership (requires Laboratory Owner approval).',
    optionStaffAction: 'Register as Staff',
    
    // Patient Form
    patientFormTitle: 'Complete Patient Profile',
    fullNameLabel: 'Full Name',
    emailLabel: 'Verified Email (Google)',
    phoneLabel: 'Phone Number',
    dobLabel: 'Date of Birth (optional)',
    genderLabel: 'Gender (optional)',
    genderMale: 'Male',
    genderFemale: 'Female',
    cityLabel: 'City',
    addressLabel: 'Residential Address (optional)',
    completePatientBtn: 'Complete Registration & Access Portal',
    patientSuccessWelcome: 'Welcome to DNA Laboratory! Your patient medical account has been successfully activated.',
    
    // Staff Form
    staffFormTitle: 'Submit Laboratory Staff Application',
    jobTitleLabel: 'Job Title & Clinical Specialization',
    jobTitlePlaceholder: 'e.g. Molecular Geneticist / Phlebotomist / Clinical Biochemist',
    additionalInfoLabel: 'Medical License Number or Qualifications (optional)',
    additionalInfoPlaceholder: 'Healthcare council registration, experience, or notes',
    submitStaffBtn: 'Submit Application for Review',
    
    // Staff Pending Notice (Exact prompt English text)
    staffPendingSuccessMessage: 'Your registration request has been received. Your account is awaiting laboratory management approval. You will be notified once a decision is made.',
    staffPendingStatusBadge: 'Account Status: Pending Approval (PENDING)',
    staffPendingDesc: 'Clinical sample accessioning, result entry, and laboratory records remain locked until officially approved by the Laboratory Owner.',
    
    // Staff Rejected Notice
    staffRejectedTitle: 'Application Status: Not Approved',
    staffRejectedDesc: 'Your application for laboratory staff membership was not approved at this time.',
    rejectionReasonLabel: 'Reason:',
    
    // Staff Approvals Manager
    staffManagerTitle: 'Staff Applications & Accreditation Review',
    staffManagerSubtitle: 'Exclusive Laboratory Owner Authority: Review credentials, verify licenses, and approve or reject staff accounts.',
    pendingListTitle: 'Pending Staff Applications',
    reviewedListTitle: 'Reviewed Application History',
    noPendingRequests: 'No pending staff applications at this time.',
    approveBtn: 'Approve & Activate Account',
    rejectBtn: 'Reject Application',
    confirmApproveMsg: 'Are you sure you want to approve this applicant and grant clinical staff permissions?',
    confirmRejectMsg: 'Please enter reason for rejection:',
    statusApproved: 'Approved & Active',
    statusRejected: 'Rejected',
    reviewedByLabel: 'Reviewed By:',
    reviewedAtLabel: 'Decision Date:',
    
    // Sandbox / Test Accounts switcher
    testAccountsTitle: 'Pre-Configured Accounts for Architectural Testing:',
    testOwnerLabel: 'Dr. Faisal Al-Qahtani (Laboratory Owner)',
    testAdminLabel: 'Eng. Tariq Al-Otaibi (Super Admin)',
    testStaffActiveLabel: 'Prof. Abdulaziz Al-Shammari (Active Staff)',
    testPatientLabel: 'Sarah Abdullah (Registered Patient)',
    oauthEnvWarning: 'Developer Note: Google OAuth Client ID is not configured in .env. Interactive verification simulation is active to thoroughly test registration and approval flows.',
  },
} as const;

export const AUTH_TRANSLATIONS = AUTH_PHASE_02;
