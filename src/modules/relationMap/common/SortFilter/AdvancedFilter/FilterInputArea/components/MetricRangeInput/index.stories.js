import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
import { action } from '@storybook/addon-actions';
import MetricRangeInput from './index';

storiesOf('Metric Range Input', module).add('m, cm', () => (
  <MetricRangeInput metric="m" metrics={['m', 'cm']} onChange={action('onChange')} />
));
