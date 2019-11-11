// @flow
import * as React from 'react';
import { defaultDistanceMetric } from 'utils/metric';
import type { MetricValue } from 'types';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import MetricValueInput from '../MetricValueInput';
import { SizeInputStyle, SeparatorStyle, SideStyle } from './style';

const SizeInput = ({
  value,
  onChange,
  readonly,
  forceBlur,
  forceFocus,
}: InputProps<{
  width: MetricValue,
  length: MetricValue,
  height: MetricValue,
}>) => {
  const handleChange = (key: string) => (sideValue: ?MetricValue) => {
    onChange({
      ...(value || {
        width: { value: 0, metric: sideValue?.metric ?? defaultDistanceMetric },
        length: { value: 0, metric: sideValue?.metric ?? defaultDistanceMetric },
        height: { value: 0, metric: sideValue?.metric ?? defaultDistanceMetric },
      }),
      [key]: sideValue || { value: 0, metric: defaultDistanceMetric },
    });
  };

  return (
    <div className={SizeInputStyle}>
      <div className={SideStyle}>
        <MetricValueInput.Length
          value={value?.width}
          focus={false}
          readonly={readonly}
          context={null}
          extra={null}
          onChange={handleChange('width')}
          forceFocus={forceFocus}
          forceBlur={forceBlur}
        />
      </div>
      <hr className={SeparatorStyle} />
      <div className={SideStyle}>
        <MetricValueInput.Length
          value={value?.height}
          readonly={readonly}
          focus={false}
          context={null}
          extra={null}
          onChange={handleChange('height')}
          forceFocus={forceFocus}
          forceBlur={forceBlur}
        />
      </div>
      <hr className={SeparatorStyle} />
      <div className={SideStyle}>
        <MetricValueInput.Length
          value={value?.length}
          readonly={readonly}
          focus={false}
          context={null}
          extra={null}
          onChange={handleChange('length')}
          forceFocus={forceFocus}
          forceBlur={forceBlur}
        />
      </div>
    </div>
  );
};

export default SizeInput;
