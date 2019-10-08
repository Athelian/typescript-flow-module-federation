// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { NumberInput, SelectInput, DefaultOptions, Display, DefaultStyle } from 'components/Form';
import { toFloat, toFloatNullable } from 'utils/number';
import { type NumberInputProps, defaultNumberInputProps } from 'components/Form/Inputs/NumberInput';
import MetricSelect from './MetricSelect';

type OptionalProps = {
  metrics: Array<string>,
  convert: (value: number, from: string, to: string) => any,
  metricSelectWidth: string,
  metricSelectHeight: string,
  metricOptionWidth: string,
  valueReadOnly: boolean,
  metricReadOnly: boolean,
  inputWidth: string,
  inputHeight: string,
  isFocused: boolean,
  disabled: boolean,
  forceHoverStyle: Object,
};

type Props = OptionalProps & NumberInputProps;

const defaultProps = {
  ...defaultNumberInputProps,
  metrics: [],
  convert: (value: number): number => value,
  metricSelectWidth: '30px',
  metricSelectHeight: '30px',
  metricOptionWidth: '35px',
  valueReadOnly: false,
  metricReadOnly: false,
  inputWidth: '200px',
  inputHeight: '30px',
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

  handleBlurMetric = (newMetric: string) => {
    const {
      onBlur,
      value: { value, metric },
      convert,
    } = this.props;

    if (onBlur) {
      const newValue = {
        target: { value: { value: convert(value, metric, newMetric), metric: newMetric } },
      };
      onBlur(newValue);
    }
  };

  render() {
    const {
      value: { value, metric },
      align,
      valueReadOnly,
      metricReadOnly,
      inputWidth,
      inputHeight,
      isFocused,
      disabled,
      forceHoverStyle,
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

    const inputWrapperConfig = {
      type: 'number',
      width: inputWidth,
      height: inputHeight,
      isFocused,
      disabled,
      forceHoverStyle,
    };

    const input = (
      <NumberInput
        {...rest}
        nullable={nullable}
        value={value}
        onChange={this.handleChangeInput}
        onBlur={this.handleBlurInput}
        align={align}
        readOnly={valueReadOnly}
      />
    );

    const select = (
      <SelectInput
        {...rest}
        readOnly={metricReadOnly}
        value={metric}
        onChange={this.handleChangeMetric}
        onBlur={this.handleBlurMetric}
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
    );

    if (valueReadOnly && metricReadOnly) {
      return (
        <Display style={{ textAlign: align }} width={inputWidth} height={inputHeight}>
          <FormattedNumber value={value} suffix={metric} />
        </Display>
      );
    }

    if (valueReadOnly && !metricReadOnly) {
      return (
        <>
          <Display align={align} height="30px">
            <FormattedNumber value={value} />
          </Display>
          <DefaultStyle width="30px" isFocused={isFocused} forceHoverStyle={forceHoverStyle}>
            {select}
          </DefaultStyle>
        </>
      );
    }

    return (
      <DefaultStyle {...inputWrapperConfig}>
        {input} {select}
      </DefaultStyle>
    );
  }
}
