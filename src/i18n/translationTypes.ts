import type { en } from "./locales/en";

export type TranslationKey = keyof typeof en;
export type TranslationResources = Record<TranslationKey, string>;
export type LanguageCode = "en" | "id";
