// @flow
import * as React from 'react';
import { defaultDistanceMetric } from 'utils/metric';
import type { InputProps } from '../../types';
import MetricValueInput from '../MetricValueInput';
import { SizeInputStyle, SeparatorStyle, SideStyle } from './style';

const SizeInput = ({
  value,
  onChange,
  focus,
  onFocus,
  onBlur,
  readonly,
  onKeyDown,
}: InputProps<{
  width: { value: number, metric: string },
  length: { value: number, metric: string },
  height: { value: number, metric: string },
}>) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleBlur = e => {
    if (!ref.current) {
      return;
    }

    if (ref.current.contains(e.relatedTarget)) {
      return;
    }

    onBlur();
  };

  return (
    <div ref={ref} className={SizeInputStyle} onFocus={onFocus} onBlur={handleBlur}>
      <div className={SideStyle}>
        <MetricValueInput.Length
          value={value?.width}
          focus={focus && !!ref.current && !ref.current.contains(document.activeElement)}
          readonly={readonly}
          context={null}
          extra={null}
          onChange={width =>
            onChange({
              ...(value || {
                length: { value: 0, metric: width?.metric ?? defaultDistanceMetric },
                height: { value: 0, metric: width?.metric ?? defaultDistanceMetric },
              }),
              width: width || { value: 0, metric: defaultDistanceMetric },
            })
          }
          onBlur={() => {}}
          onFocus={() => {}}
          onKeyDown={onKeyDown}
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
          onChange={length =>
            onChange({
              ...(value || {
                width: { value: 0, metric: length?.metric ?? defaultDistanceMetric },
                height: { value: 0, metric: length?.metric ?? defaultDistanceMetric },
              }),
              length: length || { value: 0, metric: defaultDistanceMetric },
            })
          }
          onBlur={() => {}}
          onFocus={() => {}}
          onKeyDown={onKeyDown}
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
          onChange={height =>
            onChange({
              ...(value || {
                width: { value: 0, metric: height?.metric ?? defaultDistanceMetric },
                length: { value: 0, metric: height?.metric ?? defaultDistanceMetric },
              }),
              height: height || { value: 0, metric: defaultDistanceMetric },
            })
          }
          onBlur={() => {}}
          onFocus={() => {}}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
};

export default SizeInput;
