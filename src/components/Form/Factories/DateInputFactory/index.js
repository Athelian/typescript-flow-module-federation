// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, DefaultStyle, DateInput, Blackout } from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps,
} from 'components/Form/Factories/type';
import { colors } from 'styles/common';
import { ExtraToggleButton } from '../components';

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
    vertical: boolean,
    isTouched: boolean,
    label?: React.Node,
    editable: boolean,
    blackout: boolean,
    inputColor?: string,
    showExtraToggle: boolean,
    toggled: boolean,
    onToggle?: Function,
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
  showExtraToggle: false,
  toggled: true,
};

const DateInputFactory = ({
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
  inputColor,
  value,
  name,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  inputAlign,
  editable,
  blackout,
  showExtraToggle,
  toggled,
  onToggle,
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
    required,
    ...(inputColor
      ? {
          color: colors[inputColor],
        }
      : {}),
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
          <DefaultStyle {...inputWrapperConfig}>
            <DateInput {...inputConfig} />
          </DefaultStyle>
          {showExtraToggle && <ExtraToggleButton toggled={toggled} onClick={onToggle} />}
        </>
      );
    } else {
      renderedInput = (
        <DateInput {...inputConfig} readOnlyWidth={inputWidth} readOnlyHeight={inputHeight} />
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

DateInputFactory.defaultProps = defaultProps;

export default DateInputFactory;
