// @flow
import * as React from 'react';

import { NumberInput, SelectInput, DefaultOptions } from 'components/Form';
import MetricSelect from './MetricSelect';
import { type MetricValue } from './type';

type OptionalProps = {
  disabled: boolean,
  readOnly: boolean,
  error: boolean,
  onChange: Function,
  onBlur: Function,
  align: 'left' | 'right' | 'center',
};

type Props = OptionalProps & {
  name: string,
  value: MetricValue,
  metrics: Array<string>,
};

const defaultProps = {
  disabled: false,
  readOnly: false,
  error: false,
  onChange: () => {},
  onBlur: () => {},
  metrics: [],
  align: 'right',
};

export default class MetricInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  onChange = (evt: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(evt);
    }
  };

  handleBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const {
      value: { value, metric },
      disabled,
      readOnly,
      metrics,
      align,
      ...rest
    } = this.props;

    return (
      <>
        <NumberInput
          {...rest}
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          onChange={evt =>
            this.onChange({
              ...evt,
              target: {
                value: {
                  value: evt.target.value,
                  metric,
                },
              },
            })
          }
        />
        <SelectInput
          value={metric}
          selectItem={metric}
          onChange={newMetric =>
            this.onChange({
              target: {
                value: {
                  value,
                  metric: newMetric,
                },
              },
            })
          }
          onBlur={this.handleBlur}
          items={metrics}
          itemToValue={v => v || null}
          itemToString={v => v || ''}
          renderSelect={({ ...selectProps }) => <MetricSelect {...selectProps} align={align} />}
          renderOptions={({ ...optionsProps }) => (
            <DefaultOptions width="30px" {...optionsProps} align={align} />
          )}
        />
      </>
    );
  }
}
