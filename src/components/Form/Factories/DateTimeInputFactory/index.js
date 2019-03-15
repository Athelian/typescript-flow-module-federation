// @flow
import * as React from 'react';
import {
  FieldItem,
  Label,
  FormTooltip,
  DefaultStyle,
  DateTimeInput,
  Blackout,
} from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps,
} from 'components/Form/Factories/type';

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

const DateTimeInputFactory = ({
  vertical,
  isTouched,
  label,
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

  const blackoutConfig = {
    width: inputWidth,
    height: inputHeight,
  };

  let renderedInput = <Blackout {...blackoutConfig} />;

  if (!blackout) {
    if (editable) {
      renderedInput = (
        <DefaultStyle {...inputWrapperConfig}>
          <DateTimeInput {...inputConfig} />
        </DefaultStyle>
      );
    } else {
      renderedInput = (
        <DateTimeInput {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
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

DateTimeInputFactory.defaultProps = defaultProps;

export default DateTimeInputFactory;
