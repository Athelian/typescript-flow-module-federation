import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import NotificationItem from './index';

const notification = {
  id: 123123,
  body: 'This is a notification.',
  read: true,
  createdAt: new Date().toString(),
};

storiesOf('NotificationItem', module)
  .add('read: true', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <NotificationItem notification={notification} />
    </IntlProvider>
  ))
  .add('read: false', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <NotificationItem notification={{ ...notification, read: false }} />
    </IntlProvider>
  ));
