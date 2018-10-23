// @flow
import * as React from 'react';
import { type RenderSelectProps } from 'components/Form/Inputs/SelectInput/type';
import { SelectInputStyle, MetricSelectWrapperStyle } from './style';

type OptionalProps = {
  width: string,
  height: string,
  align: 'left' | 'right' | 'center',
};

type Props = OptionalProps &
  RenderSelectProps & {
    itemToString: any => string,
  };

function MetricSelect({
  align,
  toggle,
  selectedItem,
  getInputProps,
  itemToString,
  ...rest
}: Props) {
  return (
    <div className={MetricSelectWrapperStyle} style={{ cursor: 'pointer' }}>
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

export default MetricSelect;
