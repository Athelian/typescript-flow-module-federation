// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import StyleLessSelectInput from 'components/base/SelectInput';
import {
  SelectWrapperStyle,
  OptionWrapperStyle,
  OptionStyle,
  InputStyle,
  ClearButtonStyle,
  ArrowDownStyle,
} from './style';

type Props = {
  value: any,
  items: Array<any>,
  onChange: () => void,
  error?: any,
};

const defaultProps = {
  error: null,
};

function SelectInput({ value, items, onChange, error }: Props) {
  return (
    <StyleLessSelectInput
      value={value}
      items={items}
      itemToString={item => (item ? item.label : '')}
      itemToValue={item => (item ? item.value : '')}
      clearIcon={<Icon icon="CLEAR" />}
      onChange={onChange}
      styles={{ select: SelectWrapperStyle(!!error), options: OptionWrapperStyle }}
      renderSelect={({ clearButton, isOpen }) => (
        <div className={InputStyle}>
          <div>{value && value.label}</div>
          <div className={ClearButtonStyle}>{clearButton}</div>
          <div className={ArrowDownStyle(isOpen)}>
            <Icon icon="CHEVRON_DOWN" />
          </div>
        </div>
      )}
      renderOption={({ value: item, onHover, selected }) => (
        <div className={OptionStyle(onHover, selected)}>{item.label}</div>
      )}
    />
  );
}

SelectInput.defaultProps = defaultProps;

export default SelectInput;
