import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';

import FormattedDate from './index';

storiesOf('FormattedDate', module)
  .add('en', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <FormattedDate value="2019-01-16T13:59" mode="datetime" />
    </IntlProvider>
  ))
  .add('ja', () => (
    <IntlProvider locale="ja" messages={translationMessages.ja} textComponent={React.Fragment}>
      <FormattedDate value="2019-01-16T13:59" mode="datetime" />
    </IntlProvider>
  ));
