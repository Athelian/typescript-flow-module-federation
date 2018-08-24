// @flow
import * as React from 'react';
import { isEquals } from 'utils/fp';
import { defaultPureTextInputProps } from 'components/Form/PureInputs/PureTextInput/type';
import { defaultTooltipProps } from 'components/Form/Tooltip/type';
import FieldItem from 'components/Form/FieldItem';
import { StyledTextInput } from 'components/Form/StyledInputs';

type OptionalProps = {
  placeholder: string,
  textAlign: 'left' | 'right' | 'center',
  onBlur: ?Function,
  onFocus: ?Function,
  errorMessage: React.Node,
  warningMessage: React.Node,
  infoMessage: React.Node,
  required: boolean,
  disabled: boolean,
  width: string,
  tooltipPosition: 'top' | 'bottom',
};

type Props = OptionalProps & {
  label: React.Node,
  initialValue: any,
  value: any,
  name: string,
  onChange: ?Function,
  isNew: boolean,
};

const defaultProps = {
  placeholder: '',
  textAlign: 'right',
  onBlur: null,
  onFocus: null,
  errorMessage: '',
  warningMessage: '',
  infoMessage: '',
  required: false,
  disabled: false,
  width: '100%',
  tooltipPosition: 'top',
};

const FormTextInput = ({
  label,
  initialValue,
  value,
  name,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  textAlign,
  errorMessage,
  warningMessage,
  infoMessage,
  required,
  disabled,
  isNew,
  width,
  tooltipPosition,
}: Props) => (
  <FieldItem
    label={label}
    input={hasError => (
      <StyledTextInput
        forceHoverStyle={isNew}
        hasError={hasError}
        disabled={disabled}
        width={width}
        pureTextInputProps={{
          ...defaultPureTextInputProps,
          name,
          value,
          placeholder,
          onChange,
          onBlur,
          onFocus,
          align: textAlign,
        }}
      />
    )}
    labelProps={{
      required,
    }}
    tooltipProps={{
      ...defaultTooltipProps,
      tooltipBubbleProps: {
        errorMessage,
        warningMessage,
        infoMessage,
        changedValues:
          !isNew && !isEquals(initialValue, value)
            ? {
                oldValue: initialValue,
                newValue: value,
              }
            : {
                oldValue: null,
                newValue: null,
              },
        position: tooltipPosition,
      },
    }}
  />
);

FormTextInput.defaultProps = defaultProps;

export default FormTextInput;
