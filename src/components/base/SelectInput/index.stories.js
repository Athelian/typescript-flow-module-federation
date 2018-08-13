import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';
import { Form } from 'components/Form';
import PureSearchSelectInput from './index';

const items = [
  { value: 'apple' },
  { value: 'pear' },
  { value: 'orange' },
  { value: 'grape' },
  { value: 'banana' },
];

const InputWrapperStyle = css`
  display: flex;
  align-items: center;
  width: 200px;
  height: 30px;
  padding: 0 8px;
  border-radius: 4px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  div {
    flex: 1;
  }

  input {
    outline: none;
    border: none;
  }

  button {
    border: none;
    outline: none;
    cursor: pointer;
  }
`;

const OptionWrapperStyle = css`
  outline: none;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  padding: 8px;
`;

const ItemStyle = (active, selected) => css`
  background: ${active ? 'skyblue' : '#fff'};
  background: ${selected && 'teal'};
  color: ${selected ? '#fff' : '#555'};
  cursor: pointer;
  padding: 8px;
`;

function optionItem({ value, onHover, selected }) {
  return <div className={ItemStyle(onHover, selected)}>{value.value}</div>;
}

storiesOf('SelectInput', module)
  .add('non style', () => (
    <div style={{ margin: '50px' }}>
      <Form>
        {({ values, setFieldValue }) => (
          <PureSearchSelectInput
            value={values.select}
            items={items}
            itemToString={item => (item ? item.value : '')}
            itemToValue={item => (item ? item.value : '')}
            renderSelect={renderSelect => renderSelect}
            renderOption={({ value }) => <div>{value.value}</div>}
            clearable
            onChange={value => setFieldValue('select', value)}
            wrapperStyle={{ select: '', options: '' }}
          />
        )}
      </Form>
    </div>
  ))
  .add('with custom style', () => (
    <div style={{ margin: '50px' }}>
      <Form>
        {({ values, setFieldValue }) => (
          <PureSearchSelectInput
            value={values.select}
            items={items}
            itemToString={item => (item ? item.value : '')}
            itemToValue={item => (item ? item.value : '')}
            renderSelect={renderSelect => renderSelect}
            renderOption={optionItem}
            clearable
            onChange={value => setFieldValue('select', value)}
            wrapperStyle={{ select: InputWrapperStyle, options: OptionWrapperStyle }}
          />
        )}
      </Form>
    </div>
  ));
