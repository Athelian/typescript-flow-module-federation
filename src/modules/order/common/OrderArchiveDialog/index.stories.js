import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import { BooleanValue } from 'react-values';
import OrderArchiveDialog from './index';

storiesOf('Order Archive Modal', module)
  .add('default', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <BooleanValue>
        {({ value: isOpen, toggle }) => (
          <React.Fragment>
            <button type="button" onClick={toggle}>
              open Dialog
            </button>
            <div id="dialog-root" />
            <OrderArchiveDialog
              isOpen={isOpen}
              onRequestClose={toggle}
              onCancel={toggle}
              onConfirm={toggle}
              totalBatches={21}
              unshippedBatches={7}
              shippedBatches={14}
            />
          </React.Fragment>
        )}
      </BooleanValue>
    </IntlProvider>
  ))
  .add('ja', () => (
    <IntlProvider locale="ja" messages={translationMessages.ja} textComponent={React.Fragment}>
      <BooleanValue>
        {({ value: isOpen, toggle }) => (
          <React.Fragment>
            <button type="button" onClick={toggle}>
              open Dialog
            </button>
            <div id="dialog-root" />
            <OrderArchiveDialog
              isOpen={isOpen}
              onRequestClose={toggle}
              onCancel={toggle}
              onConfirm={toggle}
              totalBatches={21}
              unshippedBatches={7}
              shippedBatches={14}
            />
          </React.Fragment>
        )}
      </BooleanValue>
    </IntlProvider>
  ));
