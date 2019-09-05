// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { getInitialLocale, translationMessages } from 'i18n';
import { useViewer } from '../Viewer';

type Context = {
  language: string,
  setLanguage: string => void,
};

export const LanguageContext = React.createContext<Context>({
  language: 'en',
  setLanguage: () => {},
});

type Props = {
  children: React.Node,
};

export const useLanguage = (): Context => React.useContext(LanguageContext);

const LanguageProvider = ({ children }: Props) => {
  const { user } = useViewer();
  const [language, setLanguage] = React.useState(getInitialLocale());

  React.useEffect(() => {
    if (!user) {
      setLanguage(getInitialLocale());
      return;
    }

    setLanguage(user.language);
  }, [user, setLanguage]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <IntlProvider
        locale={language}
        messages={translationMessages[language]}
        textComponent={React.Fragment}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
