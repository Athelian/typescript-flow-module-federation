// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import StyleLessSelectInput from 'components/base/SelectInput';
import { SelectWrapperStyle, OptionWrapperStyle, OptionStyle, InputStyle } from './style';

type Props = {
  value: any,
  items: Array<any>,
  onChange: () => void,
  error?: any,
  rest: any,
};

const defaultProps = {
  error: null,
};

function SelectInput({ value, items, onChange, error, ...rest }: Props) {
  return (
    <StyleLessSelectInput
      value={value}
      items={items}
      itemToString={item => (item ? item.label : '')}
      itemToValue={item => (item ? item.value : '')}
      clearIcon={<Icon icon="CLEAR" />}
      onChange={onChange}
      wrapperStyle={{ select: SelectWrapperStyle(!!error), options: OptionWrapperStyle }}
      renderSelect={renderSelect => <div className={InputStyle}>{renderSelect}</div>}
      renderOption={({ value: item, onHover, selected }) => (
        <div className={OptionStyle(onHover, selected)}>{item.label}</div>
      )}
      {...rest}
    />
  );
}

SelectInput.defaultProps = defaultProps;

export default SelectInput;
