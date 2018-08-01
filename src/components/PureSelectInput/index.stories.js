import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';
import Icon from 'components/Icon';
import { Form } from 'components/Form';
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

const InputStyle = css`
  display: flex;
  align-items: center;
  width: 200px;
  height: 30px;
  padding: 0 8px;
  border-radius: 4px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  & > div {
    flex: 1;
    display: flex;
    align-items: center;
    min-height: 100%;
  }
  button {
    border: none;
    outline: none;
    cursor: pointer;
  }
`;

function optionItem({ value, onHover, selected }) {
  return <div className={ItemStyle(onHover, selected)}>{value.value}</div>;
}

function Select({ currentValue }) {
  return <div>{currentValue}</div>;
}

storiesOf('PureSelectInput', module)
  .add('style less', () => (
    <div style={{ margin: '50px' }}>
      <Form>
        {({ values, setFieldValue }) => (
          <PureSelectInput
            value={values.pure}
            items={items}
            itemToString={item => (item ? item.value : '')}
            itemToValue={item => (item ? item.value : '')}
            renderSelect={
              <Select currentValue={values.pure ? values.pure.value : 'any title you want'} />
            }
            renderOption={({ value }) => <div>{value.value}</div>}
            onChange={value => setFieldValue('pure', value)}
            styles={{ select: '', options: '' }}
          />
        )}
      </Form>
    </div>
  ))
  .add('with clearBtn', () => (
    <div style={{ margin: '50px' }}>
      <Form>
        {({ values, setFieldValue }) => (
          <PureSelectInput
            value={values.select}
            items={items}
            itemToString={item => (item ? item.value : '')}
            itemToValue={item => (item ? item.value : '')}
            renderSelect={
              <Select currentValue={values.select ? values.select.value : 'any title you want'} />
            }
            renderOption={optionItem}
            clearIcon={<Icon icon="faClear" />}
            onChange={value => setFieldValue('select', value)}
            styles={{ select: '', options: '' }}
          />
        )}
      </Form>
    </div>
  ))
  .add('with styles', () => (
    <div style={{ margin: '50px' }}>
      <Form>
        {({ values, setFieldValue }) => (
          <PureSelectInput
            value={values.select}
            items={items}
            itemToString={item => (item ? item.value : '')}
            itemToValue={item => (item ? item.value : '')}
            renderSelect={
              <Select currentValue={values.select ? values.select.value : 'any title you want'} />
            }
            renderOption={optionItem}
            clearIcon={<Icon icon="faClear" />}
            onChange={value => setFieldValue('select', value)}
            styles={{ select: InputStyle, options: WrapperStyle }}
          />
        )}
      </Form>
    </div>
  ));
