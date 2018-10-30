// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { getInitialLocale, translationMessages } from 'i18n';

type ContextProps = {
  language: string,
  changeLocale: Function,
  setLocale: Function,
};

const LanguageContext: React.Context<ContextProps> = React.createContext({
  language: getInitialLocale(),
  changeLocale: () => {},
  setLocale: language => language,
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

  setLocale = (lang: string) => {
    const { language } = this.state;
    if (language !== lang) this.setState({ language: lang });
  };

  render() {
    const { children } = this.props;
    const { language } = this.state;
    return (
      <LanguageContext.Provider
        value={{ language, changeLocale: this.changeLocale, setLocale: this.setLocale }}
      >
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
