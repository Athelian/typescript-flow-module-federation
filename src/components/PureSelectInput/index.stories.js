import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';
import { Formik } from 'formik';

import PureSelectInput from './index';

const items = [
  { value: 'apple' },
  { value: 'pear' },
  { value: 'orange' },
  { value: 'grape' },
  { value: 'banana' },
];

const ItemStyle = (active, selected) => css`
  background: ${active ? 'lightgreen' : '#fff'};
  background: ${selected && 'teal'};
  width: 200px;
  color: #aaa;
  cursor: pointer;
  padding: 8px;
`;

const WrapperStyle = css`
  outline: none;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  width: 200px;
  padding: 8px;
`;

function optionItem({ value, onHover, selected }) {
  return <div className={ItemStyle(onHover, selected)}>{value.value}</div>;
}

storiesOf('PureSelectInput', module).add('normal', () => (
  <div>
    <Formik>
      {({ values, setFieldValue }) => (
        <PureSelectInput
          value={values.pure}
          items={items}
          itemToString={item => (item ? item.value : '')}
          itemToValue={item => (item ? item.value : '')}
          renderItem={({ value }) => <div>{value.value}</div>}
          onChange={value => setFieldValue('pure', value)}
        >
          <div>{values.pure ? values.pure.value : 'style less: click me!!'}</div>
        </PureSelectInput>
      )}
    </Formik>

    <Formik>
      {({ values, setFieldValue }) => (
        <PureSelectInput
          value={values.select}
          items={items}
          itemToString={item => (item ? item.value : '')}
          itemToValue={item => (item ? item.value : '')}
          renderItem={optionItem}
          optionWrapperStyle={WrapperStyle}
          onChange={value => setFieldValue('select', value)}
        >
          <div className={WrapperStyle}>
            {values.select ? values.select.value : 'select with custom style'}
          </div>
        </PureSelectInput>
      )}
    </Formik>
  </div>
));
