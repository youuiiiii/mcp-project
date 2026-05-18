import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  translations,
  type LanguageCode,
  type TranslationKey,
} from "./translations";

const LANGUAGE_STORAGE_KEY = "sigap.language";

type TranslationValues = Record<string, string | number>;

export type TFunction = (
  key: TranslationKey,
  values?: TranslationValues
) => string;

type I18nContextValue = {
  language: LanguageCode;
  languageOptions: typeof LANGUAGE_OPTIONS;
  setLanguage: (language: LanguageCode) => Promise<void>;
  t: TFunction;
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] =
    useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    let active = true;

    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (!active || !isLanguageCode(storedLanguage)) {
        return;
      }

      setLanguageState(storedLanguage);
    };

    void loadLanguage();

    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback<TFunction>(
    (key, values) => translate(language, key, values),
    [language]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      languageOptions: LANGUAGE_OPTIONS,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}

function translate(
  language: LanguageCode,
  key: TranslationKey,
  values?: TranslationValues
) {
  const template = translations[language][key] ?? translations.en[key] ?? key;
  return interpolate(template, values);
}

function interpolate(template: string, values?: TranslationValues) {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (match, token: string) => {
    const value = values[token];
    return value === undefined ? match : String(value);
  });
}

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "en" || value === "id";
}
