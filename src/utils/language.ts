import { Language } from '../types';

export function getDirection(lang: Language): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function getNextLanguage(current: Language): Language {
  return current === 'ar' ? 'en' : 'ar';
}

export function isValidLanguage(val: unknown): val is Language {
  return val === 'ar' || val === 'en';
}
