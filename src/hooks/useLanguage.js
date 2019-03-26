// @flow
import { useContext } from 'react';
import { LanguageContext } from 'modules/language';

const useLanguage = () => {
  const { language } = useContext(LanguageContext);

  return {
    isJapanese: language === 'ja',
  };
};

export default useLanguage;
