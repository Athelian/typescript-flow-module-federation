// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { NumberInput, SelectInput, DefaultOptions, Display } from 'components/Form';
import { toFloat, toFloatNullable } from 'utils/number';
import { type NumberInputProps, defaultNumberInputProps } from 'components/Form/Inputs/NumberInput';
import MetricSelect from './MetricSelect';

type OptionalProps = {
  metrics: Array<string>,
  convert: (number, string, string) => any,
  metricSelectWidth: string,
  metricSelectHeight: string,
  metricOptionWidth: string,
};

type Props = OptionalProps & NumberInputProps;

const defaultProps = {
  ...defaultNumberInputProps,
  metrics: [],
  convert: (value: number): number => value,
  metricSelectWidth: '30px',
  metricSelectHeight: '30px',
  metricOptionWidth: '35px',
};

export default class MetricInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleChangeInput = (evt: any) => {
    const {
      onChange,
      value: { metric },
    } = this.props;

    if (onChange) {
      if (evt.target.value < 0) {
        return;
      }
      onChange({
        ...evt,
        target: { value: { value: toFloatNullable(evt.target.value), metric } },
      });
    }
  };

  handleBlurInput = (evt: any) => {
    const {
      onBlur,
      value: { metric },
    } = this.props;

    if (onBlur) {
      onBlur({
        ...evt,
        target: {
          ...evt.target,
          value: { value: toFloat(evt.target.value), metric },
        },
      });
    }
  };

  handleChangeMetric = (newMetric: string) => {
    const {
      onChange,
      value: { value, metric },
      convert,
    } = this.props;

    if (onChange) {
      const newValue = {
        target: { value: { value: convert(value, metric, newMetric), metric: newMetric } },
      };
      onChange(newValue);
    }
  };

  render() {
    const {
      value: { value, metric },
      align,
      readOnly,
      readOnlyWidth,
      readOnlyHeight,
      metrics,
      convert,
      onChange,
      onBlur,
      metricSelectWidth,
      metricSelectHeight,
      metricOptionWidth,
      nullable,
      ...rest
    } = this.props;

    return readOnly ? (
      <Display style={{ textAlign: align }} width={readOnlyWidth} height={readOnlyHeight}>
        <FormattedNumber value={value} suffix={metric} />
      </Display>
    ) : (
      <>
        <NumberInput
          {...rest}
          nullable={nullable}
          value={value}
          onChange={this.handleChangeInput}
          onBlur={this.handleBlurInput}
          align={align}
        />
        <SelectInput
          {...rest}
          value={metric}
          onChange={newMetric => this.handleChangeMetric(newMetric)}
          items={metrics}
          itemToValue={v => v || null}
          itemToString={v => v || ''}
          renderSelect={({ ...selectProps }) => (
            <MetricSelect
              {...selectProps}
              width={metricSelectWidth}
              height={metricSelectHeight}
              align={align}
            />
          )}
          renderOptions={({ ...optionsProps }) => (
            <DefaultOptions {...optionsProps} width={metricOptionWidth} align={align} />
          )}
        />
      </>
    );
  }
}
