import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import { BooleanValue } from 'react-values';
import RemoveDialog from './index';

storiesOf('Remove Dialog', module).add('normal', () => (
  <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
    <BooleanValue>
      {({ value: isOpen, toggle }) => (
        <React.Fragment>
          <button type="button" onClick={toggle}>
            open Dialog
          </button>
          <div id="dialog-root" />
          <RemoveDialog
            isOpen={isOpen}
            onRequestClose={toggle}
            onCancel={toggle}
            onRemove={toggle}
            message="Are you sure to remove something?"
            width={400}
          />
        </React.Fragment>
      )}
    </BooleanValue>
  </IntlProvider>
));
