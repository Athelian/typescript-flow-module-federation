// @flow
import * as React from 'react';
import {
  FieldItem,
  Label,
  FormTooltip,
  DefaultStyle,
  MetricInput,
  Blackout,
} from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps as StandardInputProps,
} from 'components/Form/Factories/type';
import { CalculatorButton } from 'components/Form/Factories/components';
import { getMetrics, getConvert } from './helpers';

type InputProps = StandardInputProps & {
  customMetrics?: Array<string>,
  customConvert?: (number, string, string) => any,
  metricSelectWidth: string,
  metricOptionWidth: string,
};

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
    vertical: boolean,
    isTouched: boolean,
    label?: React.Node,
    InputWrapper: () => React.Node,
    Input: () => React.Node,
    metricType?: 'distance' | 'area' | 'volume' | 'weight',
    showCalculator: boolean,
    onCalculate?: Function,
    editable: boolean,
    blackout: boolean,
  };

const defaultProps = {
  labelWidth: '200px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  isTouched: false,
  InputWrapper: DefaultStyle,
  Input: MetricInput,
  showCalculator: false,
  metricSelectWidth: '30px',
  metricOptionWidth: '35px',
  editable: false,
  blackout: false,
  vertical: false,
};

const MetricInputFactory = ({
  vertical,
  isTouched,
  label,
  InputWrapper,
  Input,
  metricType,
  showCalculator,
  onCalculate,
  required,
  labelAlign,
  labelWidth,
  hideTooltip,
  isNew,
  errorMessage,
  warningMessage,
  infoMessage,
  originalValue,
  isFocused,
  disabled,
  forceHoverStyle,
  inputWidth,
  inputHeight,
  value,
  name,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  inputAlign,
  editable,
  blackout,
  customMetrics,
  customConvert,
  metricSelectWidth,
  metricOptionWidth,
}: Props): React.Node => {
  const labelConfig = { required, align: labelAlign, width: labelWidth };

  const tooltipConfig = {
    isNew,
    infoMessage,
    errorMessage: isTouched && errorMessage,
    warningMessage: isTouched && warningMessage,
    changedValues: {
      oldValue: originalValue ? `${originalValue.value} ${originalValue.metric}` : '',
      newValue: value ? `${value.value} ${value.metric}` : '',
    },
  };

  const inputWrapperConfig = {
    type: 'number',
    isFocused,
    hasError: !!(isTouched && errorMessage),
    disabled,
    forceHoverStyle,
    width: inputWidth,
    height: inputHeight,
  };

  const inputConfig = {
    value,
    name,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    align: inputAlign,
    readOnly: !editable,
    metrics: customMetrics || getMetrics(metricType),
    convert: customConvert || getConvert(metricType),
    metricSelectWidth,
    metricSelectHeight: inputHeight,
    metricOptionWidth,
  };

  const blackoutConfig = {
    width: inputWidth,
    height: inputHeight,
  };

  let renderedInput = <Blackout {...blackoutConfig} />;

  if (!blackout) {
    if (editable) {
      renderedInput = (
        <>
          <InputWrapper {...inputWrapperConfig}>
            <Input {...inputConfig} />
          </InputWrapper>
          {showCalculator && (
            <CalculatorButton data-testid="calculatorButton" onClick={onCalculate} />
          )}
        </>
      );
    } else {
      renderedInput = (
        <Input {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
      );
    }
  }

  return (
    <FieldItem
      vertical={vertical}
      label={label && <Label {...labelConfig}>{label}</Label>}
      tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
      input={renderedInput}
    />
  );
};

MetricInputFactory.defaultProps = defaultProps;

export default MetricInputFactory;
