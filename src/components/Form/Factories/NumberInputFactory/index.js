// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  FieldItem,
  Label,
  FormTooltip,
  DefaultStyle,
  NumberInput,
  Blackout,
} from 'components/Form';
import type {
  LabelProps,
  TooltipProps,
  InputWrapperProps,
  InputProps as StandardInputProps,
} from 'components/Form/Factories/type';
import { ExtraToggleButton } from 'components/Form/Factories/components';
import { SuffixStyle, CalculatorIconStyle } from './style';

type InputProps = StandardInputProps & {
  nullable?: boolean,
};

type Props = LabelProps &
  TooltipProps &
  InputWrapperProps &
  InputProps & {
    vertical: boolean,
    isTouched: boolean,
    label?: React.Node,

    showExtraToggleButton: boolean,
    onToggleAutoCalculate?: Function,
    autoCalculateIsToggled: boolean,
    autoCalculateToggleMessages?: {
      editable: {
        on: React.Node | string,
        off: React.Node | string,
      },
      readonly: {
        on: React.Node | string,
        off: React.Node | string,
      },
    },
    editable: boolean,
    blackout: boolean,
    suffix: ?(string | React.Node),
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
  suffix: null,
  vertical: false,
  showExtraToggleButton: false,
  autoCalculateIsToggled: true,
};

const NumberInputFactory = ({
  vertical,
  isTouched,
  label,
  showExtraToggleButton,
  onToggleAutoCalculate,
  autoCalculateIsToggled,
  autoCalculateToggleMessages,
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
  nullable,
  suffix,
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

    nullable,
  };
  const inputReadOnly = !editable || autoCalculateIsToggled;

  const blackoutConfig = {
    width: inputWidth,
    height: inputHeight,
  };

  let renderedInput = <Blackout {...blackoutConfig} />;

  if (!blackout) {
    renderedInput = (
      <>
        {inputReadOnly ? (
          <NumberInput
            {...inputConfig}
            readOnlyWidth={inputWidth}
            readOnlyHeight={inputHeight}
            readOnlySuffix={suffix}
            readOnly
          />
        ) : (
          <>
            <DefaultStyle {...inputWrapperConfig}>
              <NumberInput {...inputConfig} />
              {suffix && <div className={SuffixStyle}>{suffix}</div>}
            </DefaultStyle>
          </>
        )}

        {showExtraToggleButton && (
          <div>
            <div className={CalculatorIconStyle}>
              <Icon icon="CALCULATOR" />
            </div>
            <ExtraToggleButton
              editable={editable}
              toggled={autoCalculateIsToggled}
              onClick={onToggleAutoCalculate}
              toggleMessages={autoCalculateToggleMessages}
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

NumberInputFactory.defaultProps = defaultProps;

export default NumberInputFactory;
