// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, DefaultStyle, NumberInput } from 'components/Form';

type LabelProps = {
  required?: boolean,
  labelAlign?: 'left' | 'right' | 'center',
  labelWidth?: string,
};

type TooltipProps = {
  hideTooltip?: boolean,
  isNew?: boolean,
  errorMessage?: string,
  warningMessage?: React.Node,
  infoMessage?: React.Node,
  originalValue?: any,
};

type InputWrapperProps = {
  isFocused?: boolean,
  disabled?: boolean,
  forceHoverStyle?: boolean,
  inputWidth?: string,
  inputHeight?: string,
};

type InputProps = {
  value?: any,
  name?: string,
  placeholder?: React.Node,
  onChange?: ?Function,
  onBlur?: ?Function,
  onFocus?: ?Function,
  inputAlign?: 'left' | 'right' | 'center',
  readOnly?: boolean,
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
  };

const defaultProps = {
  labelWidth: '200px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  isTouched: false,
  InputWrapper: DefaultStyle,
  Input: NumberInput,
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
          <InputWrapper {...inputWrapperConfig}>
            <Input {...inputConfig} />
          </InputWrapper>
        )
      }
    />
  );
};

NumberInputFactory.defaultProps = defaultProps;

export default NumberInputFactory;
