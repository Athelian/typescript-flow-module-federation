// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, DefaultStyle, DateInput } from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps,
} from 'modules/form/factories/type';

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
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
  Input: DateInput,
};

const DateInputFactory = ({
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
    type: 'date',
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

DateInputFactory.defaultProps = defaultProps;

export default DateInputFactory;
