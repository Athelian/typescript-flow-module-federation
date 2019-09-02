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

import { DiffDateStyle } from './style';

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
    showSyncIcon: boolean,
    showDiff: Boolean,
    diff: number,
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
  showDiff: false,
  diff: 0,
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
  showDiff,
  diff,
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
    renderedInput = (
      <>
        {editable ? (
          <DefaultStyle {...inputWrapperConfig}>
            <DateInput {...inputConfig} />
          </DefaultStyle>
        ) : (
          <DateInput
            {...inputConfig}
            color={inputColor}
            readOnlyWidth={inputWidth}
            readOnlyHeight={inputHeight}
          />
        )}
        {showDiff && (
          <div className={DiffDateStyle(diff)}>
            {diff > 0 && '+'}
            {diff !== 0 && diff}
          </div>
        )}
        {showExtraToggle && (
          <ExtraToggleButton
            editable={editable}
            toggled={toggled}
            onClick={onToggle}
            toggleMessages={toggleMessages}
          />
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
