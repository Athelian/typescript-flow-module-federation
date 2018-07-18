// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import { translationMessages } from '../src/i18n';

type Props = {
  children: React.Node,
};

export default function Wrapper({ children }: Props) {
  return (
    <IntlProvider messages={translationMessages.en} locale="en">
      <Router>{children}</Router>
    </IntlProvider>
  );
}
