import React from 'react';
import { Calendar, FlaskConical, ShieldCheck, Award, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { HERO_TRANSLATIONS } from '../data/translations';

interface HeroProps {
  currentLang: Language;
}

export const Hero: React.FC<HeroProps> = ({ currentLang }) => {
  const content = HERO_TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section 
      id="home"
      className="relative min-h-[calc(100vh-5rem)] md:min-h-[720px] lg:min-h-[820px] flex items-center overflow-hidden bg-slate-50"
    >
      {/* 
        Official Scientific Background:
        - Image 1: /images/dna-hero-background.jpg
        - DNA double helix visible on the RIGHT
        - Clean white space preserved on the LEFT
        - Professional sizing with zero distortion (object-cover)
        - Mobile: intelligent repositioning preserving the helix & legibility
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/images/dna-hero-background.jpg"
          alt={isRtl ? 'خلفية مختبر الدنا العلمية' : 'DNA Laboratory Scientific Background'}
          className="w-full h-full object-cover object-[85%_15%] sm:object-[80%_center] md:object-[82%_center] lg:object-right transition-all duration-700"
          loading="eager"
        />

        {/* 
          Desktop Soft Gradient Shield:
          Always goes from pure white/light on the physical LEFT to transparent on the physical RIGHT.
          This guarantees maximum typography contrast on the left without dulling the DNA double helix on the right.
        */}
        <div 
          className="absolute inset-0 hidden lg:block bg-gradient-to-r from-white/95 via-white/80 via-45% to-transparent pointer-events-none" 
        />
        
        {/* Tablet Gradient */}
        <div 
          className="absolute inset-0 hidden sm:block lg:hidden bg-gradient-to-r from-white/95 via-white/85 to-white/30 pointer-events-none" 
        />

        {/* Mobile luminous gradient wash: ensures high readability while showing the helix at the top */}
        <div 
          className="absolute inset-0 sm:hidden bg-gradient-to-b from-white/30 via-white/80 via-35% to-white pointer-events-none" 
        />
      </div>

      {/* 
        Hero Content Container:
        Physically positioned on the LEFT side of the canvas across both Arabic and English,
        so the text occupies the clean white space, and the right side remains open for the DNA double helix.
      */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className={`flex w-full ${isRtl ? 'lg:justify-end' : 'lg:justify-start'}`}>
          
          <div className="w-full lg:max-w-2xl xl:max-w-3xl flex flex-col items-start text-start bg-white/70 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-5 sm:p-0 rounded-3xl sm:rounded-none border border-white/80 sm:border-transparent shadow-sm sm:shadow-none">
            
            {/* Medical Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50/90 border border-teal-200/80 text-teal-800 text-xs sm:text-sm font-semibold mb-5 shadow-xs backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>{content.badge}</span>
            </div>

            {/* Main Heading - Exact Prompt Text */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-4 sm:mb-5">
              <span className="block text-slate-900">{content.title}</span>
              <span className="block text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-600 bg-clip-text text-transparent mt-1.5 sm:mt-2">
                {isRtl ? 'الريادة في الفحص الجيني والتحاليل الطبية' : 'Excellence in Diagnostics & Genetic Testing'}
              </span>
            </h1>

            {/* Subtitle - Exact Prompt Text */}
            <p className="text-base sm:text-xl text-slate-700 font-medium leading-relaxed max-w-2xl mb-6 sm:mb-8">
              {content.subtitle}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8 sm:mb-10">
              {/* Primary Button */}
              <a
                href="#booking"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 text-base font-bold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
              >
                <Calendar className="w-5 h-5 text-teal-100" />
                <span>{content.primaryCta}</span>
                <ArrowIcon className="w-4 h-4" />
              </a>

              {/* Secondary Button */}
              <a
                href="#tests"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 text-base font-bold text-teal-900 bg-white/90 hover:bg-white border border-teal-200 hover:border-teal-300 rounded-xl shadow-xs hover:shadow transition-all duration-200 backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <FlaskConical className="w-5 h-5 text-teal-700" />
                <span>{content.secondaryCta}</span>
              </a>
            </div>

            {/* Trust and Quality Features */}
            <div className="w-full pt-5 sm:pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {content.features.map((feature, idx) => (
                <div key={feature.id} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50/80 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                  <div className="p-1.5 rounded-md bg-teal-100/80 text-teal-800 shrink-0">
                    {idx === 0 && <Award className="w-4 h-4" />}
                    {idx === 1 && <ShieldCheck className="w-4 h-4" />}
                    {idx === 2 && <Clock className="w-4 h-4" />}
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
