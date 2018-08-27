// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureTextInput } from 'components/Form/PureInputs';
import { defaultPureTextInputProps } from 'components/Form/PureInputs/PureTextInput/type';
import { type StyledTextInputProps as Props, defaultStyledTextInputProps } from './type';
import { StyledTextInputWrapperStyle, StyledTextInputStyle } from './style';

const StyledTextInput = ({
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  pureInputOptions,
}: Props) => {
  const mergedPureInputOptions = { ...defaultPureTextInputProps, ...pureInputOptions };

  return (
    <div
      className={StyledTextInputWrapperStyle(isFocused, hasError, disabled, forceHoverStyle, width)}
    >
      {disabled ? (
        <Display align={pureInputOptions.align}>{pureInputOptions.value}</Display>
      ) : (
        <PureTextInput {...mergedPureInputOptions} className={StyledTextInputStyle} />
      )}
    </div>
  );
};

StyledTextInput.defaultProps = defaultStyledTextInputProps;

export default StyledTextInput;
