import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { css } from 'react-emotion';
import { Form } from 'components/Form';
import Icon from 'components/Icon';
import PureSearchSelectInput from './index';

const items = [
  { label: 'APPLE', value: 'apple' },
  { label: 'PEAR', value: 'pear' },
  { label: 'ORANGE', value: 'orange' },
  { label: 'GRAPE', value: 'grape' },
  { label: 'BANANA', value: 'banana' },
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
  return <div className={ItemStyle(onHover, selected)}>{value.label}</div>;
}

function renderSelect({ input, selectedItem, clearSelection, toggle }) {
  return (
    <div>
      {input}
      {selectedItem && (
        <button type="button" onClick={clearSelection}>
          <Icon icon="CLEAR" />
        </button>
      )}
      <button type="button" onClick={toggle}>
        <Icon icon="CHEVRON_DOWN" />
      </button>
    </div>
  );
}

storiesOf('SearchSelectInput', module)
  .add('non style', () => (
    <div style={{ margin: '50px' }}>
      <Form>
        {({ values, setFieldValue }) => (
          <PureSearchSelectInput
            value={values.select}
            items={items}
            itemToString={item => (item ? item.label : '')}
            itemToValue={item => (item ? item.value : '')}
            renderSelect={renderSelect}
            renderOption={({ value }) => <div>{value.label}</div>}
            onChange={value => setFieldValue('select', value)}
            styles={{ input: '', options: '' }}
            onSearch={action('search')}
            clearable
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
            name="select"
            value={values.select}
            items={items}
            itemToString={item => (item ? item.label : '')}
            itemToValue={item => (item ? item.value : '')}
            renderSelect={renderSelect}
            renderOption={optionItem}
            clearable
            onChange={value => setFieldValue('select', value)}
            styles={{ input: InputWrapperStyle, options: OptionWrapperStyle }}
            onSearch={action('search')}
          />
        )}
      </Form>
    </div>
  ));
