import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import { BooleanValue } from 'react-values';
import ConfirmDialog from './index';

storiesOf('Confirm Dialog', module).add('normal', () => (
  <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
    <BooleanValue>
      {({ value: isOpen, toggle }) => (
        <React.Fragment>
          <button type="button" onClick={toggle}>
            open Dialog
          </button>
          <div id="dialog-root" />
          <ConfirmDialog
            isOpen={isOpen}
            onRequestClose={toggle}
            onCancel={toggle}
            onConfirm={toggle}
            message="Are you sure to leave me?"
            width={400}
          />
        </React.Fragment>
      )}
    </BooleanValue>
  </IntlProvider>
));
