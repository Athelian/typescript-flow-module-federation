import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
// action
import { action } from '@storybook/addon-actions';
import MetricInputItem from './index';

storiesOf('Metric Input Item', module)
  .add('only min', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <MetricInputItem
        min={1}
        metric="cm"
        onRemove={action('remove')}
        name="packageLength"
        label="PKG LENGTH"
      />
    </IntlProvider>
  ))
  .add('only max', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <MetricInputItem
        max={100000}
        metric="m"
        onRemove={action('remove')}
        name="packageLength"
        label="PKG LENGTH"
      />
    </IntlProvider>
  ))
  .add('min, max', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <MetricInputItem
        min={0}
        max={9999}
        metric="cm"
        onRemove={action('remove')}
        name="packageLength"
        label="PKG LENGTH"
      />
    </IntlProvider>
  ));
