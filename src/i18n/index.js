// @flow
import { takeItems } from 'utils/fp';
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import jaLocaleData from 'react-intl/locale-data/ja';
import zhLocaleData from 'react-intl/locale-data/zh';

import enTranslationMessages from './translations/en.json';
import jaTranslationMessages from './translations/ja.json';
import zhTranslationMessages from './translations/zh.json';

addLocaleData(enLocaleData);
addLocaleData(jaLocaleData);
addLocaleData(zhLocaleData);

const appLocales = ['en', 'ja', 'zh'];

const DEFAULT_LOCALE = 'en';

export const formatTranslationMessages = (locale: string, messages: Object) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE ? defaultFormattedMessages[key] : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  }, {});
};

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  ja: formatTranslationMessages('ja', jaTranslationMessages),
  zh: formatTranslationMessages('zh', zhTranslationMessages),
};

export const getInitialLocale = (): string => {
  const browserLocale = navigator.languages ? navigator.languages[0] : navigator.language;

  const formattedLocale = takeItems(2, browserLocale || 'en');

  return appLocales.includes(formattedLocale) ? formattedLocale : 'ja';
};
