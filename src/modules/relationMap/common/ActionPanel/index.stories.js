/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { IntlProvider } from 'react-intl';
import { storiesOf } from '@storybook/react';
import { translationMessages } from 'i18n';
import SplitPanel from './SplitPanel';
import ActionSelector from './ActionSelector';
import { SelectedPanel, ApplyPanel } from './ConnectPanel';
import 'styles/reset.css';

storiesOf('RelationMap/ActionPanel', module)
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
        <SelectedPanel />
        <ApplyPanel />
      </>
    </IntlProvider>
  ));
