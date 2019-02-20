// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, DefaultStyle, TextInput } from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps as StandardInputWrapperProps,
  InputProps,
} from 'components/Form/Factories/type';

type InputWrapperProps = StandardInputWrapperProps & {
  type?: 'standard' | 'label',
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
    editable?: boolean,
  };

const defaultProps = {
  labelWidth: '200px',
  inputWidth: '200px',
  inputHeight: '30px',
  hideTooltip: false,
  isTouched: false,
  InputWrapper: DefaultStyle,
  Input: TextInput,
  editable: true,
  vertical: false,
};

const TextInputFactory = ({
  vertical,
  isTouched,
  label,
  InputWrapper,
  Input,
  required,
  labelAlign,
  labelWidth,
  inputAlign,
  hideTooltip,
  isNew,
  errorMessage,
  warningMessage,
  infoMessage,
  originalValue,
  type,
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
  editable,
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
    type,
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
  };

  return (
    <FieldItem
      vertical={vertical}
      label={label && <Label {...labelConfig}>{label}</Label>}
      tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
      input={
        editable ? (
          <InputWrapper {...inputWrapperConfig}>
            <Input {...inputConfig} />
          </InputWrapper>
        ) : (
          <Input {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
        )
      }
    />
  );
};

TextInputFactory.defaultProps = defaultProps;

export default TextInputFactory;
