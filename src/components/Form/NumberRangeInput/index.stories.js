import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
import { action } from '@storybook/addon-actions';
import NumberRange from './index';

storiesOf('Number Range Input', module)
  .add('no min, no max', () => <NumberRange />)
  .add('no min, has max', () => <NumberRange max={1} />)
  .add('has min, no max', () => <NumberRange min={1} />)
  .add('has min, has max', () => (
    <NumberRange
      min={1}
      max={10}
      onChangeMin={action('onChangeMin')}
      onChangeMax={action('onChangeMax')}
    />
  ));
