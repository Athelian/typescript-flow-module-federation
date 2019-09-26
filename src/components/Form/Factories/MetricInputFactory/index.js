// @flow
import * as React from 'react';
import Icon from 'components/Icon';
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
import { convertValueToFormFieldFormat } from 'components/Form/Factories/helpers';
import { ExtraToggleButton } from 'components/Form/Factories/components';
import { getMetrics, getDefaultMetric, getConvert, type MetricEnumType } from './helpers';
import { CalculatorIconStyle } from '../NumberInputFactory/style';

type InputProps = StandardInputProps & {
  customMetrics?: Array<string>,
  customConvert?: (value: number, from: string, to: string) => any,
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

    showExtraToggleButton: boolean,
    onToggleAutoCalculate?: Function,
    autoCalculateIsToggled: boolean,
    autoCalculateToggleMessages?: {
      editable: {
        on: React.Node | string,
        off: React.Node | string,
      },
      readonly: {
        on: React.Node | string,
        off: React.Node | string,
      },
    },
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

  showExtraToggleButton: false,
  autoCalculateIsToggled: true,
};

const MetricInputFactory = ({
  vertical,
  isTouched,
  label,
  metricType,

  showExtraToggleButton,
  onToggleAutoCalculate,
  autoCalculateIsToggled,
  autoCalculateToggleMessages,

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
    onFocus: () => {
      if (onFocus) {
        onFocus();
      }
      if (onChange && !value) {
        onChange(convertValueToFormFieldFormat({ metric: getDefaultMetric(metricType), value: 0 }));
      }
    },
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
          </>
        ) : (
          <MetricInput {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
        )}
        {showExtraToggleButton && (
          <div>
            <div className={CalculatorIconStyle}>
              <Icon icon="CALCULATOR" />
            </div>
            <ExtraToggleButton
              editable={editable}
              toggled={autoCalculateIsToggled}
              onClick={onToggleAutoCalculate}
              toggleMessages={autoCalculateToggleMessages}
            />
          </div>
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
