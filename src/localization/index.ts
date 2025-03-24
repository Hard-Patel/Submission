/**
 * @format
 */
import i18n, {LanguageDetectorModule} from 'i18next';
import {initReactI18next} from 'react-i18next';

import {noop} from '../constants/index';

import {en} from './en';
import {fr} from './fr';

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => 'en',
  init: noop,
  cacheUserLanguage: noop,
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    debug: true,
    resources: {
      en: {translation: {...en}},
      fr: {translation: {...fr}},
    },
  });

const switchLanguage = (lang: string) => i18n.changeLanguage(lang);

export {switchLanguage};
export default i18n;
