// @flow
import * as React from 'react';
import {
  FieldItem,
  Label,
  FormTooltip,
  DefaultStyle,
  NumberInput,
  Blackout,
} from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps as StandardInputProps,
} from 'components/Form/Factories/type';
import { CalculatorButton, AutoCalculateToggle } from 'components/Form/Factories/components';

type InputProps = StandardInputProps & {
  nullable?: boolean,
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
    showCalculator: boolean,
    onCalculate?: Function,
    showAutoCalculateToggle: boolean,
    onToggleAutoCalculate?: Function,
    autoCalculateIsToggled: boolean,
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
  Input: NumberInput,
  editable: false,
  blackout: false,
  vertical: false,
  showCalculator: false,
  showAutoCalculateToggle: false,
  autoCalculateIsToggled: true,
};

const NumberInputFactory = ({
  vertical,
  isTouched,
  label,
  InputWrapper,
  Input,
  showCalculator,
  onCalculate,
  showAutoCalculateToggle,
  onToggleAutoCalculate,
  autoCalculateIsToggled,
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
  nullable,
}: Props): React.Node => {
  const labelConfig = { required, align: labelAlign, width: labelWidth };

  const tooltipConfig = {
    isNew,
    infoMessage,
    errorMessage: isTouched && errorMessage,
    warningMessage: isTouched && warningMessage,
    changedValues: {
      oldValue: originalValue,
      newValue: value,
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
    nullable,
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
          {showAutoCalculateToggle && (
            <AutoCalculateToggle toggled={autoCalculateIsToggled} onClick={onToggleAutoCalculate} />
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

NumberInputFactory.defaultProps = defaultProps;

export default NumberInputFactory;
