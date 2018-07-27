// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { getInitialLocale, translationMessages } from 'i18n';

const LanguageContext = React.createContext({
  language: getInitialLocale(),
  changeLocale: () => {},
});

type Props = {
  children: React.Node,
};

type State = {
  language: string,
};

class LanguageProvider extends React.Component<Props, State> {
  state = {
    language: getInitialLocale(),
  };

  changeLocale = () => {
    this.setState(prevState => ({ language: prevState.language === 'en' ? 'ja' : 'en' }));
  };

  render() {
    const { children } = this.props;
    const { language } = this.state;
    return (
      <LanguageContext.Provider value={{ language, changeLocale: this.changeLocale }}>
        <IntlProvider
          locale={language}
          messages={translationMessages[language]}
          textComponent={React.Fragment}
        >
          {children}
        </IntlProvider>
      </LanguageContext.Provider>
    );
  }
}

export const LanguageConsumer = LanguageContext.Consumer;

export default LanguageProvider;
