// @flow
import * as React from 'react';
import { SelectInputStyle, MetricSelectWrapperStyle } from './style';

type UselessProps = {
  isOpen?: ?boolean,
};

type OptionalProps = {
  width: string,
  height: string,
  align: 'left' | 'right' | 'center',
  toggle: () => void,
  selectedItem: any,
  getInputProps: Function,
  clearSelection: Function,
};

type Props = OptionalProps &
  UselessProps & {
    itemToString: any => string,
  };

const defaultProps = {
  width: '30px',
  height: '30px',
};

function MetricSelect({
  width,
  height,
  align,
  toggle,
  selectedItem,
  getInputProps,
  itemToString,
  clearSelection,
  isOpen,
  ...rest
}: Props) {
  return (
    <div className={MetricSelectWrapperStyle({ width, height })} style={{ cursor: 'pointer' }}>
      <input
        readOnly
        spellCheck={false}
        onClick={toggle}
        className={SelectInputStyle(align)}
        {...getInputProps({
          value: itemToString(selectedItem),
        })}
        {...rest}
      />
    </div>
  );
}

MetricSelect.defaultProps = defaultProps;

export default MetricSelect;
