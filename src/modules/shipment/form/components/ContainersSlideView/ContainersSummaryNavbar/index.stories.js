import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';

import Summary from './index';

storiesOf('module shipment', module).add('container list slide-view summary', () => (
  <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
    <Summary
      agreedArrivalDateFrom="2019-01-23T01:01:00Z"
      actualArrivalDateTo="2019-02-23T01:01:00Z"
      containers={[1, 2, 2]}
      approvedAgreementSize={1}
      approvedConfirmationSize={2}
    />
  </IntlProvider>
));
