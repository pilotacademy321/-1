import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, StaffStatus } from '../types/auth';
import { AppRoute } from '../types/navigation';
import { authClient } from '../services/authClient';
import { db } from '../server/db';

export interface RouterContextType {
  currentRoute: AppRoute | 'auth:signin' | 'auth:signup';
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  navigateTo: (route: AppRoute | 'auth:signin' | 'auth:signup') => void;
  signOut: () => void;
  signInAsRole: (role: UserRole, staffStatus?: StaffStatus) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute | 'auth:signin' | 'auth:signup'>('public:home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Restore session on mount
  useEffect(() => {
    authClient.restoreSession().then(session => {
      if (session) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.full_name,
          role: session.user.role,
          staffStatus: session.user.role === 'staff' ? (session.user.account_status as any) : undefined,
          patientStatus: session.user.role === 'patient' ? (session.user.account_status as any) : undefined,
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at,
          emailVerified: true,
        });
      }
    });
  }, []);

  const navigateTo = (route: AppRoute | 'auth:signin' | 'auth:signup') => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const signOut = async () => {
    await authClient.logout();
    setCurrentUser(null);
    setCurrentRoute('public:home');
  };

  const signInAsRole = async (role: UserRole, staffStatus?: StaffStatus) => {
    if (role === 'lab_owner') {
      const res = await authClient.authenticateWithGoogle({
        googleUid: 'google_owner_1092837465',
        email: 'owner@dnalab.internal',
        name: 'د. فيصل القحطاني',
      });
      if (res.session) {
        setCurrentUser({
          id: res.session.user.id,
          email: res.session.user.email,
          displayName: res.session.user.full_name,
          role: res.session.user.role,
          staffStatus: undefined,
          patientStatus: undefined,
          createdAt: res.session.user.created_at,
          updatedAt: res.session.user.updated_at,
          emailVerified: true,
        });
        setCurrentRoute(res.session.redirectRoute as any);
      }
    } else if (role === 'super_admin') {
      const res = await authClient.authenticateWithGoogle({
        googleUid: 'google_admin_9876543210',
        email: 'admin@dnalab.internal',
        name: 'م. طارق العتيبي',
      });
      if (res.session) {
        setCurrentUser({
          id: res.session.user.id,
          email: res.session.user.email,
          displayName: res.session.user.full_name,
          role: res.session.user.role,
          staffStatus: undefined,
          patientStatus: undefined,
          createdAt: res.session.user.created_at,
          updatedAt: res.session.user.updated_at,
          emailVerified: true,
        });
        setCurrentRoute(res.session.redirectRoute as any);
      }
    } else if (role === 'staff' && staffStatus === 'approved') {
      const res = await authClient.authenticateWithGoogle({
        googleUid: 'google_staff_5566778899',
        email: 'specialist@dnalab.internal',
        name: 'أ.د. عبد العزيز الشمري',
      });
      if (res.session) {
        setCurrentUser({
          id: res.session.user.id,
          email: res.session.user.email,
          displayName: res.session.user.full_name,
          role: res.session.user.role,
          staffStatus: 'approved',
          createdAt: res.session.user.created_at,
          updatedAt: res.session.user.updated_at,
          emailVerified: true,
        });
        setCurrentRoute('staff:dashboard');
      }
    } else if (role === 'staff' && staffStatus === 'pending') {
      const googleUid = 'google_staff_pending_demo';
      const existingUser = await db.getUserByGoogleUid(googleUid);
      if (!existingUser) {
        await authClient.registerStaff(
          { googleUid, email: 'pending.staff@dnalab.internal', name: 'سارة المنصور' },
          { fullName: 'سارة المنصور', phone: '+966500001122', city: 'الرياض', jobTitle: 'فني سحب وتحضير عينات', additionalInfo: 'بكالوريوس تقنية مختبرات' }
        );
      }
      const res = await authClient.authenticateWithGoogle({
        googleUid,
        email: 'pending.staff@dnalab.internal',
        name: 'سارة المنصور',
      });
      if (res.session) {
        setCurrentUser({
          id: res.session.user.id,
          email: res.session.user.email,
          displayName: res.session.user.full_name,
          role: 'staff',
          staffStatus: 'pending',
          createdAt: res.session.user.created_at,
          updatedAt: res.session.user.updated_at,
          emailVerified: true,
        });
        setCurrentRoute('staff:dashboard');
      }
    } else if (role === 'patient') {
      const googleUid = 'google_patient_demo';
      const existingUser = await db.getUserByGoogleUid(googleUid);
      if (!existingUser) {
        await authClient.registerPatient(
          { googleUid, email: 'patient.demo@gmail.com', name: 'خالد عبدالله السالم' },
          { fullName: 'خالد عبدالله السالم', phone: '+966551234567', city: 'الرياض', dateOfBirth: '1990-05-15', gender: 'male' }
        );
      }
      const res = await authClient.authenticateWithGoogle({
        googleUid,
        email: 'patient.demo@gmail.com',
        name: 'خالد عبدالله السالم',
      });
      if (res.session) {
        setCurrentUser({
          id: res.session.user.id,
          email: res.session.user.email,
          displayName: res.session.user.full_name,
          role: 'patient',
          patientStatus: 'active',
          createdAt: res.session.user.created_at,
          updatedAt: res.session.user.updated_at,
          emailVerified: true,
        });
        setCurrentRoute('patient:profile');
      }
    }
    setIsAuthModalOpen(false);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <RouterContext.Provider
      value={{
        currentRoute,
        currentUser,
        setCurrentUser,
        navigateTo,
        signOut,
        signInAsRole,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
