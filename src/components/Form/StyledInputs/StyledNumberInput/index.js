// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureNumberInput } from 'components/Form/PureInputs';
import { defaultPureNumberInputProps } from 'components/Form/PureInputs/PureNumberInput/type';
import { type StyledNumberInputProps as Props, defaultStyledNumberInputProps } from './type';
import { StyledNumberInputWrapperStyle, StyledNumberInputStyle } from './style';

const StyledNumberInput = ({
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  pureInputOptions,
}: Props) => {
  const mergedPureInputOptions = { ...defaultPureNumberInputProps, ...pureInputOptions };

  return (
    <div
      className={StyledNumberInputWrapperStyle(
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
        <PureNumberInput {...mergedPureInputOptions} className={StyledNumberInputStyle} />
      )}
    </div>
  );
};

StyledNumberInput.defaultProps = defaultStyledNumberInputProps;

export default StyledNumberInput;
