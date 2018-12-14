import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
import { action } from '@storybook/addon-actions';
import NumberRangeWithMetricInput from './index';

storiesOf('EntityTypes Input', module).add('default', () => (
  <NumberRangeWithMetricInput metric="m" metrics={['m', 'cm']} onChange={action('onChange')} />
));
