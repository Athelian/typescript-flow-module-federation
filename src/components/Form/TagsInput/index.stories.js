/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TagsInput from './index';

storiesOf('Form/TagsInput', module).add('with label', () => (
  <form onSubmit={action('submit')}>
    <TagsInput
      required
      name="qty"
      label="Qty"
      onChange={action('onChange')}
      onBlur={action('onBlur')}
      value={10}
      permissions="rw"
    />
  </form>
));
