// @flow
import { take } from 'ramda';
import { addLocaleData } from 'react-intl';
/* $FlowFixMe: load direct from bundle file */
import enLocaleData from 'react-intl/locale-data/en';
/* $FlowFixMe: load direct from bundle file */
import jaLocaleData from 'react-intl/locale-data/ja';

import enTranslationMessages from './translations/en.json';
import jaTranslationMessages from './translations/ja.json';

addLocaleData(enLocaleData);
addLocaleData(jaLocaleData);

const appLocales = ['en', 'ja'];

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
};

export const getInitialLocale = (): string => {
  const browserLocale = navigator.languages ? navigator.languages[0] : navigator.language;

  const formattedLocale = take(2, browserLocale);

  return appLocales.includes(formattedLocale) ? formattedLocale : 'ja';
};
