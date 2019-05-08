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
import { CalculatorButton, ExtraToggleButton } from 'components/Form/Factories/components';
import { getMetrics, getConvert, type MetricEnumType } from './helpers';

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
    metricType?: MetricEnumType,
    showCalculator: boolean,
    onCalculate?: Function,
    showExtraToggleButton: boolean,
    onToggleAutoCalculate?: Function,
    autoCalculateIsToggled: boolean,
    editable: boolean,
    blackout: boolean,
  };

const defaultProps = {
  labelWidth: '200px',
  labelHeight: '30px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  isTouched: false,
  metricSelectWidth: '30px',
  metricOptionWidth: '35px',
  editable: false,
  blackout: false,
  vertical: false,
  showCalculator: false,
  showExtraToggleButton: false,
  autoCalculateIsToggled: true,
};

const MetricInputFactory = ({
  vertical,
  isTouched,
  label,
  metricType,
  showCalculator,
  showExtraToggleButton,
  onToggleAutoCalculate,
  autoCalculateIsToggled,
  onCalculate,
  required,
  labelAlign,
  labelWidth,
  labelHeight,
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
  const labelConfig = { required, align: labelAlign, width: labelWidth, height: labelHeight };

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
    renderedInput = (
      <>
        {editable ? (
          <>
            <DefaultStyle {...inputWrapperConfig}>
              <MetricInput {...inputConfig} />
            </DefaultStyle>
            {showCalculator && <CalculatorButton onClick={onCalculate} />}
          </>
        ) : (
          <MetricInput {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
        )}
        {showExtraToggleButton && (
          <ExtraToggleButton
            editable={editable}
            toggled={autoCalculateIsToggled}
            onClick={onToggleAutoCalculate}
          />
        )}
      </>
    );
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
