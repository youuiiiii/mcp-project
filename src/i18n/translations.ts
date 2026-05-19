import { en } from "./locales/en";
import { id } from "./locales/id";
import type { LanguageCode, TranslationResources } from "./translationTypes";

export type {
  LanguageCode,
  TranslationKey,
  TranslationResources,
} from "./translationTypes";

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export const LANGUAGE_OPTIONS: {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "id",
    label: "Indonesian",
    nativeLabel: "Bahasa Indonesia",
  },
];

export const translations: Record<LanguageCode, TranslationResources> = {
  en,
  id,
};
