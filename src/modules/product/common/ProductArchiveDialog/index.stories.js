import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import { BooleanValue } from 'react-values';
import ProductArchiveDialog from './index';

storiesOf('Product Archive Modal', module)
  .add('default', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <BooleanValue>
        {({ value: isOpen, toggle }) => (
          <React.Fragment>
            <button type="button" onClick={toggle}>
              open Dialog
            </button>
            <div id="dialog-root" />
            <ProductArchiveDialog isOpen={isOpen} onRequestClose={toggle} />
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
            <ProductArchiveDialog isOpen={isOpen} onRequestClose={toggle} />
          </React.Fragment>
        )}
      </BooleanValue>
    </IntlProvider>
  ));
