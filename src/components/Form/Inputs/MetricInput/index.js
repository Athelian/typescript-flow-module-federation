// @flow
import * as React from 'react';

import { NumberInput, SelectInput, DefaultOptions } from 'components/Form';
import MetricSelect from './MetricSelect';
import { type MetricValue } from './type';

type OptionalProps = {
  isNew: boolean,
  disabled: boolean,
  readOnly: boolean,
  error: boolean,
  onChange: Function,
  onBlur: Function,
  isTouched: boolean,
  errorMessage: string,
  isFocused: boolean,
  align: 'left' | 'right' | 'center',
};

type Props = OptionalProps & {
  name: string,
  value: MetricValue,
  metrics: Array<string>,
};

const defaultProps = {
  isNew: true,
  disabled: false,
  readOnly: false,
  error: false,
  onChange: () => {},
  onBlur: () => {},
  metrics: [],
  isTouched: false,
  errorMessage: '',
  isFocused: false,
  align: 'right',
};

export default class MetricInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  onChange = ({ value, metric }: MetricValue) => {
    const { name, onChange } = this.props;
    if (onChange) {
      onChange(name, { value, metric });
    }
  };

  handleBlur = () => {
    const { name, onBlur } = this.props;
    if (onBlur) {
      onBlur(name, true);
    }
  };

  render() {
    const {
      value: { value, metric },
      disabled,
      readOnly,
      metrics,
      align,
    } = this.props;

    return (
      <>
        <NumberInput
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          onChange={e => this.onChange({ value: e.target.value, metric })}
        />
        <SelectInput
          value={metric}
          selectItem={metric}
          onChange={newMetric => this.onChange({ value, metric: newMetric })}
          items={metrics}
          itemToValue={v => v || null}
          itemToString={v => v || ''}
          renderSelect={({ ...rest }) => <MetricSelect {...rest} align={align} />}
          renderOptions={({ ...rest }) => <DefaultOptions width="100px" {...rest} align="left" />}
        />
      </>
    );
  }
}
