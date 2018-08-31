// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureTextAreaInput } from 'components/Form/PureInputs';
import { defaultPureTextInputProps } from 'components/Form/PureInputs/PureTextInput/type';
import { type StyledTextAreaInputProps as Props, defaultStyledTextAreaInputProps } from './type';
import { StyledTextInputWrapperStyle, StyledTextInputStyle } from './style';

const StyledTextAreaInput = ({
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  pureInputOptions,
}: Props) => {
  const mergedPureInputOptions = { ...defaultPureTextInputProps, ...pureInputOptions };

  return (
    <div
      className={StyledTextInputWrapperStyle(
        isFocused,
        hasError,
        disabled,
        forceHoverStyle,
        width,
        height
      )}
    >
      {disabled ? (
        <Display align={pureInputOptions.align}>{pureInputOptions.value}</Display>
      ) : (
        <PureTextAreaInput {...mergedPureInputOptions} className={StyledTextInputStyle} />
      )}
    </div>
  );
};

StyledTextAreaInput.defaultProps = defaultStyledTextAreaInputProps;

export default StyledTextAreaInput;
