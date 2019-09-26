// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FieldItem, Label, FormTooltip, DefaultStyle, DateInput, Blackout } from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps,
} from 'components/Form/Factories/type';
import { colors } from 'styles/common';
import { ExtraToggleButton } from '../components';

import { ShipmentIconStyle } from './style';

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
    toggleMessages?: {
      editable: {
        on: React.Node | string,
        off: React.Node | string,
      },
      readonly: {
        on: React.Node | string,
        off: React.Node | string,
      },
    },
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
  toggled: false,
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
  toggleMessages,
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
    required,
    ...(inputColor
      ? {
          color: colors[inputColor],
        }
      : {}),
  };

  const inputReadOnly = !editable || toggled;

  const blackoutConfig = {
    width: inputWidth,
    height: inputHeight,
  };

  let renderedInput = <Blackout {...blackoutConfig} />;

  if (!blackout) {
    renderedInput = (
      <>
        {inputReadOnly ? (
          <DateInput
            {...inputConfig}
            readOnly
            color={inputColor}
            readOnlyWidth={inputWidth}
            readOnlyHeight={inputHeight}
          />
        ) : (
          <DefaultStyle {...inputWrapperConfig}>
            <DateInput {...inputConfig} />
          </DefaultStyle>
        )}
        {showExtraToggle && (
          <div>
            <div className={ShipmentIconStyle}>
              <Icon icon="SHIPMENT" />
            </div>
            <ExtraToggleButton
              editable={editable}
              toggled={toggled}
              onClick={onToggle}
              toggleMessages={toggleMessages}
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

DateInputFactory.defaultProps = defaultProps;

export default DateInputFactory;
