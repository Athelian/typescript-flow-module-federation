import * as React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';

import { SelectInput } from 'components/Form';
import DefaultSelect from './DefaultSelect';
import DefaultOptions from './DefaultOptions';

const items = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
];

storiesOf('Default Select Style', module).add('SelectInput', () => (
  <SelectInput
    name="select-input"
    value="3"
    items={items}
    itemToValue={v => v || null}
    itemToString={v => v || ''}
    renderSelect={({ ...rest }) => <DefaultSelect {...rest} required align="left" width="120px" />}
    renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" width="120px" />}
  />
));
