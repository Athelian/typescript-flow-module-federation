import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MetricInput from './index';
import DefaultMetricStyle from '../Styles/DefaultStyle/DefaultMetricStyle';

storiesOf('Metric Input', module)
  .add('100cm', () => (
    <MetricInput
      name="metric"
      value={{ value: 100, metric: 'cm' }}
      metrics={['m', 'cm']}
      onChange={action('onChange')}
    />
  ))
  .add('100cm with DefaultMetricStyle', () => (
    <DefaultMetricStyle>
      <MetricInput
        name="metric"
        value={{ value: 100, metric: 'cm' }}
        metrics={['m', 'cm']}
        onChange={action('onChange')}
      />
    </DefaultMetricStyle>
  ));
