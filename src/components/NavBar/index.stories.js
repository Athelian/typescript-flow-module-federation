import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import NavBar from './index';
import ViewToggle from './components/ViewToggle';

storiesOf('Navbar', module).add('title', () => (
  <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
    <div style={{ height: '2000px' }}>
      <NavBar>
        <ViewToggle />
      </NavBar>
      <div style={{ marginTop: '500px' }}>Content</div>
    </div>
  </IntlProvider>
));
