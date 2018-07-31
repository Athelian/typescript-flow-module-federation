// @flow
import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
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
  background: ${active ? 'pink' : '#fff'};
  background: ${selected && 'purple'};
  height: 100%;
  width: 150px;
  color: #aaa;
  cursor: pointer;
`;

const selectBoxStyle = css`
  outline: none;
  border: none;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  padding: 8px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 12px;
  width: 100px;
`;

function optionItem({
  value,
  isActive,
  selected,
}: {
  value: string,
  isActive: boolean,
  selected: boolean,
}) {
  return <div className={ItemStyle(isActive, selected)}>{value}</div>;
}

storiesOf('PureSelectInput', module).add('normal', () => (
  <Formik>
    {({ values, setFieldValue }) => (
      <PureSelectInput
        value={values.select}
        items={items}
        itemToString={item => (item ? item.value : '')}
        itemToValue={item => (item ? item.value : '')}
        renderItem={optionItem}
        optionWrapperStyle={selectBoxStyle}
        onChange={value => setFieldValue('select', value)}
      >
        <div className={selectBoxStyle}>{values.select ? values.select.value : 'select'}</div>
      </PureSelectInput>
    )}
  </Formik>
));
