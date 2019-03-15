// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, DefaultStyle, TextInput, Blackout } from 'components/Form';
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
  editable: false,
  blackout: false,
  vertical: false,
};

const TextInputFactory = ({
  vertical,
  isTouched,
  label,
  required,
  labelAlign,
  labelWidth,
  labelHeight,
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
  blackout,
}: Props): React.Node => {
  const labelConfig = { required, align: labelAlign, width: labelWidth, height: labelHeight };

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

  const blackoutConfig = {
    width: inputWidth,
    height: inputHeight,
  };

  let renderedInput = <Blackout {...blackoutConfig} />;

  if (!blackout) {
    if (editable) {
      renderedInput = (
        <DefaultStyle {...inputWrapperConfig}>
          <TextInput {...inputConfig} />
        </DefaultStyle>
      );
    } else {
      renderedInput = (
        <TextInput {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
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

TextInputFactory.defaultProps = defaultProps;

export default TextInputFactory;
