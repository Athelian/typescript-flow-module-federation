// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PurePasswordInput } from 'components/Form/PureInputs';
import { defaultPurePasswordInputProps } from 'components/Form/PureInputs/PurePasswordInput/type';
import { type StyledPasswordInputProps as Props, defaultStyledPasswordInputProps } from './type';
import { StyledPasswordInputWrapperStyle, StyledPasswordInputStyle } from './style';

const StyledPasswordInput = ({
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  pureInputOptions,
}: Props) => {
  const mergedPureInputOptions = { ...defaultPurePasswordInputProps, ...pureInputOptions };

  return (
    <div
      className={StyledPasswordInputWrapperStyle(
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
        <PurePasswordInput {...mergedPureInputOptions} className={StyledPasswordInputStyle} />
      )}
    </div>
  );
};

StyledPasswordInput.defaultProps = defaultStyledPasswordInputProps;

export default StyledPasswordInput;
