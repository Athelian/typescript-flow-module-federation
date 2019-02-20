/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { IntlProvider } from 'react-intl';
import { storiesOf } from '@storybook/react';
import { translationMessages } from 'i18n';
import SplitPanel from './SplitPanel';
import ClonePanel from './ClonePanel';
import ActionSelector from './ActionSelector';
import { SelectedPanel, ApplyPanel, SuccessPanel, ConnectTypePanel } from './ConnectPanel';
import 'styles/reset.css';

storiesOf('RelationMap/ActionPanel', module)
  .add('ClonePanel', () => (
    <IntlProvider locale="en" messages={translationMessages.en}>
      <ClonePanel />
    </IntlProvider>
  ))
  .add('SplitPanel', () => (
    <IntlProvider locale="en" messages={translationMessages.en}>
      <SplitPanel />
    </IntlProvider>
  ))
  .add('ActionSelector', () => (
    <IntlProvider locale="en" messages={translationMessages.en}>
      <ActionSelector />
    </IntlProvider>
  ))
  .add('ConnectPanel', () => (
    <IntlProvider locale="en" messages={translationMessages.en}>
      <>
        <ConnectTypePanel />
        <SelectedPanel type="SHIPMENT" />
        <SelectedPanel type="ORDER" />
        <ApplyPanel />
        <SuccessPanel />
      </>
    </IntlProvider>
  ))
  .add('SuccessPanel', () => (
    <IntlProvider locale="en" messages={translationMessages.en}>
      <SuccessPanel />
    </IntlProvider>
  ));
