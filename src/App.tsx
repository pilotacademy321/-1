/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { getDirection } from './utils/language';
import { RouterProvider, useRouter } from './router/RouterContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { PortalLayout } from './components/layout/PortalLayout';
import { AuthPage } from './components/auth/AuthPage';

function AppContent() {
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const { currentUser, currentRoute, isAuthModalOpen, closeAuthModal, navigateTo } = useRouter();

  useEffect(() => {
    const dir = getDirection(currentLang);
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
    
    if (currentLang === 'ar') {
      document.title = 'مختبر الدنا الطبي — منظومة المصادقة وتسجيل الحسابات';
    } else {
      document.title = 'DNA Medical Laboratory — Google Authentication & Registration';
    }
  }, [currentLang]);

  return (
    <>
      {currentUser ? (
        <PortalLayout
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          currentUser={currentUser}
        />
      ) : currentRoute === 'auth:signin' || currentRoute === 'auth:signup' ? (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
          <AuthPage
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            onClose={() => navigateTo('public:home')}
          />
        </div>
      ) : (
        <PublicLayout
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
        />
      )}

      {/* Modal Dialog for Google Sign In & Registration */}
      {isAuthModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-xl">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 end-4 z-50 text-white/80 hover:text-white p-2"
              aria-label="Close"
            >
              ✕
            </button>
            <AuthPage
              currentLang={currentLang}
              onLanguageChange={setCurrentLang}
              onClose={closeAuthModal}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
