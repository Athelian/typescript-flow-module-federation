// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureEmailInput } from 'components/Form/PureInputs';
import { defaultPureEmailInputProps } from 'components/Form/PureInputs/PureEmailInput/type';
import { type StyledEmailInputProps as Props, defaultStyledEmailInputProps } from './type';
import { StyledEmailInputWrapperStyle, StyledEmailInputStyle } from './style';

const StyledEmailInput = ({
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  pureInputOptions,
}: Props) => {
  const mergedPureInputOptions = { ...defaultPureEmailInputProps, ...pureInputOptions };

  return (
    <div
      className={StyledEmailInputWrapperStyle(
        isFocused,
        hasError,
        disabled,
        forceHoverStyle,
        width
      )}
    >
      {disabled ? (
        <Display align={pureInputOptions.align}>{pureInputOptions.value}</Display>
      ) : (
        <PureEmailInput {...mergedPureInputOptions} className={StyledEmailInputStyle} />
      )}
    </div>
  );
};

StyledEmailInput.defaultProps = defaultStyledEmailInputProps;

export default StyledEmailInput;
