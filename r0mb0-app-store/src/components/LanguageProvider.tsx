'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  detectBrowserLocale,
  DICTIONARIES,
  Dictionary,
  LanguagePreference,
  Locale,
} from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  preference: LanguagePreference;
  setPreference: (pref: LanguagePreference) => void;
  t: Dictionary;
}

const STORAGE_KEY = 'r0mb0-store-lang';

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<LanguagePreference>('auto');
  const [browserLocale, setBrowserLocale] = useState<Locale>('en');

  useEffect(() => {
    setBrowserLocale(detectBrowserLocale());
    const saved = window.localStorage.getItem(STORAGE_KEY) as LanguagePreference | null;
    if (saved && (saved === 'auto' || saved in DICTIONARIES)) {
      setPreferenceState(saved);
    }
  }, []);

  const locale: Locale = preference === 'auto' ? browserLocale : preference;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setPreference = (pref: LanguagePreference) => {
    setPreferenceState(pref);
    window.localStorage.setItem(STORAGE_KEY, pref);
  };

  const value = useMemo(
    () => ({
      locale,
      preference,
      setPreference,
      t: DICTIONARIES[locale] || DICTIONARIES.en,
    }),
    [locale, preference]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used inside LanguageProvider');
  }
  return ctx;
}