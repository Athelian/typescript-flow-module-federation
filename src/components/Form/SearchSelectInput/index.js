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
  value: any,
  items: Array<any>,
  onChange: () => void,
  onSearch: string => void,
  error?: any,
  itemToString: any => string,
  itemToValue: any => any,
  hasHoverStyle?: boolean,
  width?: ?number,
};

const defaultProps = {
  error: null,
  hasHoverStyle: false,
  width: null,
};

function SelectInput({ error, itemToString, width, hasHoverStyle, ...rest }: Props) {
  return (
    <StyleLessSelectInput
      name="name"
      itemToString={itemToString}
      clearIcon={<Icon icon="CLEAR" />}
      styles={{ input: InputStyle, options: OptionWrapperStyle }}
      renderSelect={({ input, isOpen, toggle, clearSelection, selectedItem }) => (
        <div
          className={SelectWrapperStyle(!!error, isOpen, !!hasHoverStyle && !selectedItem, width)}
        >
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
