// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, DefaultStyle, NumberInput } from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps as StandardInputProps,
} from 'modules/form/factories/type';
import Icon from 'components/Icon';
import { CalculatorButtonStyle } from './style';

type InputProps = StandardInputProps & {
  nullable?: boolean,
};

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
    isTouched: boolean,
    label?: React.Node,
    InputWrapper: () => React.Node,
    Input: () => React.Node,
    showCalculator: boolean,
    onCalculate?: Function,
  };

const defaultProps = {
  labelWidth: '200px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  isTouched: false,
  InputWrapper: DefaultStyle,
  Input: NumberInput,
  showCalculator: false,
};

const NumberInputFactory = ({
  isTouched,
  label,
  InputWrapper,
  Input,
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
  readOnly,
  nullable,
  showCalculator,
  onCalculate,
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
    readOnly,
    nullable,
  };

  return (
    <FieldItem
      label={label && <Label {...labelConfig}>{label}</Label>}
      tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
      input={
        readOnly ? (
          <Input {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
        ) : (
          <>
            <InputWrapper {...inputWrapperConfig}>
              <Input {...inputConfig} />
            </InputWrapper>
            {showCalculator && (
              <button
                data-testid="calculatorButton"
                className={CalculatorButtonStyle}
                type="button"
                onClick={onCalculate}
              >
                <Icon icon="CALCULATOR" />
              </button>
            )}
          </>
        )
      }
    />
  );
};

NumberInputFactory.defaultProps = defaultProps;

export default NumberInputFactory;
