import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MetricInput from './index';
import DefaultMetricStyle from './DefaultMetricStyle';

storiesOf('Metric Input', module)
  .add('without style wrapper', () => (
    <MetricInput
      name="metric"
      value={{ value: 100, metric: 'cm' }}
      metrics={['m', 'cm']}
      onChange={action('onChange')}
    />
  ))
  .add('with style wrapper', () => (
    <DefaultMetricStyle width="400px">
      <MetricInput
        name="metric"
        value={{ value: 100, metric: 'cm' }}
        metrics={['m', 'cm']}
        onChange={action('onChange')}
      />
    </DefaultMetricStyle>
  ));
