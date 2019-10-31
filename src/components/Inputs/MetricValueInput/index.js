// @flow
import * as React from 'react';
import { MetricValueInputStyle } from './style';

type RenderInputProps = {
  value: number,
  onChange: (SyntheticInputEvent<any>) => any,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
};

type RenderSelectProps = {
  value: string,
  required: true,
  onChange: string => void,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
  items: Array<string>,
  filterItems: (query: string, items: Array<string>) => Array<string>,
  itemToString: any => string,
  itemToValue: any => any,
};

type Props = {
  value: { value: number, metric: string } | null,
  onChange: ({ value: number, metric: string } | null) => void,
  onFocus?: (SyntheticFocusEvent<any>) => void,
  onBlur?: (SyntheticFocusEvent<any>) => void,
  metrics: Array<string>,
  defaultMetric: string,
  renderInput: RenderInputProps => React.Node,
  renderSelect: RenderSelectProps => React.Node,
};

const MetricValueInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  metrics,
  defaultMetric,
  renderInput,
  renderSelect,
}: Props) => (
  <div className={MetricValueInputStyle}>
    {renderInput({
      value: value?.value ?? 0,
      onChange: e => onChange({ ...(value || { metric: defaultMetric }), value: e.target.value }),
      onFocus,
      onBlur,
    })}
    {renderSelect({
      value: value?.metric ?? defaultMetric,
      required: true,
      onChange: newMetric => onChange({ ...(value || { value: 0 }), metric: newMetric }),
      onFocus,
      onBlur,
      items: metrics,
      filterItems: (q, items) => items,
      itemToString: i => i,
      itemToValue: i => i,
    })}
  </div>
);

export default MetricValueInput;
