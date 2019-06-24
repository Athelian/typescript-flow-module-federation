/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import MetricInputItem from './index';

storiesOf('Metric Input Item', module)
  .add('only min', () => (
    <MetricInputItem
      min={1}
      metric="cm"
      onRemove={action('remove')}
      name="packageLength"
      label="PKG DEPTH"
    />
  ))
  .add('only max', () => (
    <MetricInputItem
      max={100000}
      metric="m"
      onRemove={action('remove')}
      name="packageLength"
      label="PKG DEPTH"
    />
  ))
  .add('min, max', () => (
    <MetricInputItem
      min={0}
      max={9999}
      metric="cm"
      onRemove={action('remove')}
      name="packageLength"
      label="PKG DEPTH"
    />
  ));
