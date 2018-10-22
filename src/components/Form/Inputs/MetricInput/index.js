// @flow
import * as React from 'react';

import {
  NumberInput,
  DefaultStyle,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
  Display,
} from 'components/Form';

import { type MetricValue } from './type';
import { MetricInputWrapperStyle } from './style';

type Props = {
  isNew?: boolean,
  name: string,
  value: MetricValue,
  disabled?: boolean,
  readOnly?: boolean,
  error?: boolean,
  onChange?: Function,
  onBlur?: Function,
  metrics: Array<string>,
  isTouched?: boolean,
  errorMessage?: string,
  isFocused?: boolean,
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
      isNew,
    } = this.props;

    return (
      <div className={MetricInputWrapperStyle}>
        {disabled || readOnly ? (
          <>
            <Display align="right">{value}</Display>
            <Display align="left">{metric}</Display>
          </>
        ) : (
          <>
            <DefaultStyle type="number" forceHoverStyle={isNew}>
              <NumberInput
                value={value}
                disabled={disabled}
                readOnly={readOnly}
                onChange={e => this.onChange({ value: e.target.value, metric })}
              />
            </DefaultStyle>
            <SelectInput
              value={metric}
              selectItem={metric}
              onChange={newMetric => this.onChange({ value, metric: newMetric })}
              items={metrics}
              itemToValue={v => v || null}
              itemToString={v => v || ''}
              renderSelect={({ ...rest }) => <DefaultSelect {...rest} align="left" />}
              renderOptions={({ ...rest }) => <DefaultOptions {...rest} align="left" />}
            />
          </>
        )}
      </div>
    );
  }
}
