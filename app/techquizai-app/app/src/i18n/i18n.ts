import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to TechQuiz AI",
      login: "Login",
      start_quiz: "Start Quiz",
      home: "Home",
      profile: "Profile",
      quiz_result: "Quiz Result",
      score: "Score: {{score}} / {{total}}",
      back_home: "Back to Home",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode ?? 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4', // Required for React Native compatibility
  });

export default i18n;
