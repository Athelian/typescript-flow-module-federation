/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Form } from 'components/Form';
import { injectUid } from 'utils/id';
import SelectInput from './index';

const items = [
  { label: 'ZenCafe', value: '1' },
  { label: 'Macdonard', value: '2' },
  { label: 'KoreanBBQ', value: '3' },
  { label: 'BadChinese', value: '4' },
  { label: 'Mumbai Curry', value: '5' },
].map(injectUid);

storiesOf('Form/SelectInput', module)
  .add('default', () => (
    <div style={{ width: '300px' }}>
      <Form>
        {({ values, setFieldValue }) => (
          <SelectInput
            value={values.selection}
            items={items}
            onChange={value => setFieldValue('selection', value)}
          />
        )}
      </Form>
    </div>
  ))
  .add('error', () => (
    <div style={{ width: '300px' }}>
      <Form>
        {({ values, setFieldValue }) => (
          <SelectInput
            value={values.selection}
            error="Error"
            items={items}
            onChange={value => setFieldValue('selection', value)}
          />
        )}
      </Form>
    </div>
  ));
