// @flow
import * as React from 'react';
import { FieldItem, Label, DefaultStyle, PasswordInput } from 'components/Form';
import FormTooltip from 'components/Form/FormTooltip';
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

const PasswordInputFactory = ({
  value,
  name,
  label,
  placeholder,
  required,
  disabled,
  editable,
  labelAlign,
  labelWidth,
  labelHeight,
  inputWidth,
  inputHeight,
  inputAlign,
  vertical,
  isTouched,
  isNew,
  isFocused,
  errorMessage,
  warningMessage,
  infoMessage,
  hideTooltip,
  forceHoverStyle,
  onChange,
  onBlur,
  onFocus,
}: Props): React.Node => {
  const labelConfig = { required, align: labelAlign, width: labelWidth, height: labelHeight };

  const tooltipConfig = {
    isNew,
    infoMessage,
    errorMessage: isTouched && errorMessage,
    warningMessage: isTouched && warningMessage,
  };

  const inputWrapperConfig = {
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
      label={<Label {...labelConfig}>{label}</Label>}
      tooltip={!hideTooltip ? <FormTooltip {...tooltipConfig} /> : null}
      input={
        <DefaultStyle {...inputWrapperConfig}>
          <PasswordInput
            data-testid="password"
            {...inputConfig}
            readOnlyWidth={inputWidth}
            readOnlyHeight={inputHeight}
          />
        </DefaultStyle>
      }
    />
  );
};

PasswordInputFactory.defaultProps = defaultProps;

export default PasswordInputFactory;
