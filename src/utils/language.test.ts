import test from 'node:test';
import assert from 'node:assert/strict';
import { getDirection, getNextLanguage, isValidLanguage } from './language';
import { HERO_TRANSLATIONS, NAV_ITEMS } from '../data/translations';

test('getDirection returns correct dir for Arabic and English', () => {
  assert.equal(getDirection('ar'), 'rtl');
  assert.equal(getDirection('en'), 'ltr');
});

test('getNextLanguage toggles between ar and en', () => {
  assert.equal(getNextLanguage('ar'), 'en');
  assert.equal(getNextLanguage('en'), 'ar');
});

test('isValidLanguage validates accepted language codes', () => {
  assert.equal(isValidLanguage('ar'), true);
  assert.equal(isValidLanguage('en'), true);
  assert.equal(isValidLanguage('fr'), false);
  assert.equal(isValidLanguage(null), false);
});

test('Hero translations contain mandatory prompt copy', () => {
  // Arabic requirements
  assert.equal(HERO_TRANSLATIONS.ar.title, 'مختبر الدنا');
  assert.equal(HERO_TRANSLATIONS.ar.subtitle, 'دقة في الفحص، ثقة في النتائج، واهتمام بصحتك.');
  assert.equal(HERO_TRANSLATIONS.ar.primaryCta, 'احجز موعدك الآن');
  assert.equal(HERO_TRANSLATIONS.ar.secondaryCta, 'استكشف التحاليل');

  // English requirements
  assert.equal(HERO_TRANSLATIONS.en.title, 'DNA Laboratory');
  assert.equal(HERO_TRANSLATIONS.en.subtitle, 'Precision in Testing. Confidence in Results. Care for Your Health.');
  assert.equal(HERO_TRANSLATIONS.en.primaryCta, 'Book an Appointment');
  assert.equal(HERO_TRANSLATIONS.en.secondaryCta, 'Explore Tests');
});

test('Navigation items include all 5 requested visual links', () => {
  const ids = NAV_ITEMS.map(i => i.id);
  assert.deepEqual(ids, ['home', 'tests', 'booking', 'about', 'contact']);
});
