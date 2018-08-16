// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import StyleLessSelectInput from 'components/base/SearchSelectInput';
import {
  SelectWrapperStyle,
  InputStyle,
  ButtonStyle,
  OptionWrapperStyle,
  OptionStyle,
  ArrowDownStyle,
} from '../SelectInput/style';

type Props = {
  items: Array<any>,
  onChange: () => void,
  onSearch: string => void,
  error?: any,
  itemToString: any => string,
  itemToValue: any => any,
};

const defaultProps = {
  error: null,
};

function SelectInput({ error, itemToString, ...rest }: Props) {
  return (
    <StyleLessSelectInput
      name="name"
      itemToString={itemToString}
      clearIcon={<Icon icon="CLEAR" />}
      styles={{ input: InputStyle, options: OptionWrapperStyle }}
      renderSelect={({ input, isOpen, toggle, clearSelection, selectedItem }) => (
        <div className={SelectWrapperStyle(!!error)}>
          {input}
          {selectedItem ? (
            <button type="button" onClick={clearSelection} className={ButtonStyle}>
              <Icon icon="CLEAR" />
            </button>
          ) : (
            <button type="button" onClick={toggle} className={ArrowDownStyle(isOpen)}>
              <Icon icon="CHEVRON_DOWN" />
            </button>
          )}
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
