'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, ThemeMode } from '@/config/site';
import { getUiText, UiDictionary } from '@/i18n/ui';

interface AppPreferencesContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  ui: UiDictionary;
}

const DEFAULT_VALUE: AppPreferencesContextValue = {
  lang: 'vi',
  setLang: () => undefined,
  toggleLang: () => undefined,
  theme: 'dark',
  setTheme: () => undefined,
  toggleTheme: () => undefined,
  ui: getUiText('vi'),
};

const AppPreferencesContext = createContext<AppPreferencesContextValue>(DEFAULT_VALUE);

const LANG_STORAGE_KEY = 'api_lab_lang';
const THEME_STORAGE_KEY = 'api_lab_theme';

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('vi');
  const [theme, setThemeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    try {
      const savedLang = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'vi' || savedLang === 'en') {
        setLangState(savedLang);
      }
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value: AppPreferencesContextValue = {
    lang,
    setLang,
    toggleLang,
    theme,
    setTheme,
    toggleTheme,
    ui: getUiText(lang),
  };

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences(): AppPreferencesContextValue {
  return useContext(AppPreferencesContext);
}
