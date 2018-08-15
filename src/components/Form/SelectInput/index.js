// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import StyleLessSelectInput from 'components/base/SelectInput';
import {
  SelectWrapperStyle,
  InputStyle,
  ButtonStyle,
  OptionWrapperStyle,
  OptionStyle,
  ArrowDownStyle,
} from './style';

type Props = {
  value: any,
  items: Array<any>,
  onChange: () => void,
  error?: any,
  itemToString: any => string,
  itemToValue: any => any,
};

const defaultProps = {
  error: null,
};

function SelectInput({ value, items, onChange, error, itemToString, itemToValue, ...rest }: Props) {
  return (
    <StyleLessSelectInput
      value={value}
      items={items}
      itemToString={itemToString}
      itemToValue={itemToValue}
      clearIcon={<Icon icon="CLEAR" />}
      onChange={onChange}
      styles={{ input: InputStyle, options: OptionWrapperStyle }}
      renderSelect={({ input, isOpen, toggle, clearSelection, selectedItem }) => (
        <div className={SelectWrapperStyle(!!error)}>
          {input}
          {selectedItem && (
            <button type="button" onClick={clearSelection} className={ButtonStyle}>
              <Icon icon="CLEAR" />
            </button>
          )}
          <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
            <Icon icon="CHEVRON_DOWN" />
          </button>
        </div>
      )}
      renderOption={({ value: item, onHover, selected }) => (
        <div className={OptionStyle(onHover, selected)}>{itemToString(item)}</div>
      )}
      {...rest}
    />
  );
}

SelectInput.defaultProps = defaultProps;

export default SelectInput;
