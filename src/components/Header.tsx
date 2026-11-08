import React, { useState } from 'react';
import { Globe, Menu, X, Calendar, ArrowUpRight, LogIn, UserCheck } from 'lucide-react';
import { Language } from '../types';
import { NAV_ITEMS, COMMON_STRINGS } from '../data/translations';
import { getNextLanguage } from '../utils/language';
import { useRouter } from '../router/RouterContext';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentLang, onLanguageChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const common = COMMON_STRINGS[currentLang];
  const { openAuthModal, currentUser, navigateTo, currentRoute } = useRouter();

  const handleToggleLang = () => {
    onLanguageChange(getNextLanguage(currentLang));
  };

  const getPortalHomeRoute = (role: string) => {
    switch (role) {
      case 'super_admin': return 'admin:overview';
      case 'lab_owner': return 'owner:dashboard';
      case 'staff': return 'staff:dashboard';
      case 'patient': return 'patient:profile';
      default: return 'public:home';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <a 
              href="#home" 
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
              aria-label={common.brandName}
            >
              {/* Official DNA Laboratory Logo - Natural proportions & transparent background */}
              <img
                src="/images/dna-laboratory-logo.png"
                alt={common.altLogo}
                className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                loading="eager"
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                className={`px-3.5 py-2 text-sm xl:text-base font-semibold rounded-lg transition-all duration-200 ${
                  index === 0
                    ? 'text-teal-700 bg-teal-50/70 hover:bg-teal-100/60'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                {item.label[currentLang]}
              </a>
            ))}
          </nav>

          {/* Header Action Elements */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={handleToggleLang}
              type="button"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 rounded-xl transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label={`Switch language to ${common.langSwitchLabel}`}
            >
              <Globe className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-teal-600" />
              <span>{common.langSwitchLabel}</span>
            </button>

            {/* Sign In / Portal Access Button */}
            {currentUser ? (
              <button
                type="button"
                onClick={() => navigateTo(getPortalHomeRoute(currentUser.role) as any)}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-teal-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors"
              >
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">
                  {currentLang === 'ar' ? 'البوابة النشطة' : 'Active Portal'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-teal-800 bg-white hover:bg-slate-50 border border-slate-300 hover:border-teal-400 rounded-xl shadow-xs transition-all duration-200"
              >
                <LogIn className="w-4 h-4 text-teal-700" />
                <span>{common.signIn}</span>
              </button>
            )}

            {/* Quick appointment visual CTA */}
            <a
              href="#booking"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 rounded-xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <Calendar className="w-4 h-4" />
              <span>{currentLang === 'ar' ? 'حجز فحص' : 'Book Test'}</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? common.menuClose : common.menuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 mb-2">
            <span className="text-xs font-semibold text-slate-400">
              {currentLang === 'ar' ? 'قائمة التصفح' : 'Navigation Menu'}
            </span>
            <button
              onClick={handleToggleLang}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg"
            >
              <Globe className="w-3.5 h-3.5" />
              {common.langSwitchLabel}
            </button>
          </div>

          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                index === 0
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-teal-700'
              }`}
            >
              <span>{item.label[currentLang]}</span>
              <ArrowUpRight className="w-4 h-4 opacity-50" />
            </a>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  navigateTo(getPortalHomeRoute(currentUser.role) as any);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-bold text-teal-900 bg-emerald-50 border border-emerald-300 rounded-xl"
              >
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <span>{currentLang === 'ar' ? 'الدخول إلى البوابة النشطة' : 'Go to Active Portal'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4 text-teal-700" />
                <span>{common.signIn}</span>
              </button>
            )}

            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{currentLang === 'ar' ? 'حجز موعد فحص' : 'Book Test Appointment'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
