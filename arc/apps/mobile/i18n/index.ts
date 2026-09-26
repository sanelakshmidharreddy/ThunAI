import { en } from './en.ts';
import { ta } from './ta.ts';
import { hi } from './hi.ts';
import { te } from './te.ts';
import { LanguageCode } from '../../../shared/schemas/index.ts';

export const translations = {
  en,
  ta,
  hi,
  te,
};

export function getTranslation(lang: LanguageCode) {
  return translations[lang] || translations.en;
}

export const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string; nativeName: string }> = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
];
