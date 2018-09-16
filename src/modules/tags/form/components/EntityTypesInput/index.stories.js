import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import EntityTypesInput from './index';

storiesOf('EntityTypes Input', module).add('default', () => (
  <EntityTypesInput name="test" items={[1, 2, 3, 4]} value={[1, 3]} onChange={action('onChange')} />
));
