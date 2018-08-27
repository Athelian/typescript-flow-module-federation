// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureDateInput } from 'components/Form/PureInputs';
import { defaultPureDateInputProps } from 'components/Form/PureInputs/PureDateInput/type';
import { type StyledDateInputProps as Props, defaultStyledDateInputProps } from './type';
import { StyledDateInputWrapperStyle, StyledDateInputStyle } from './style';

const StyledDateInput = ({
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  pureInputOptions,
}: Props) => {
  const mergedPureInputOptions = { ...defaultPureDateInputProps, ...pureInputOptions };

  return (
    <div
      className={StyledDateInputWrapperStyle(isFocused, hasError, disabled, forceHoverStyle, width)}
    >
      {disabled ? (
        <Display align={pureInputOptions.align}>{pureInputOptions.value}</Display>
      ) : (
        <PureDateInput
          {...mergedPureInputOptions}
          className={StyledDateInputStyle(pureInputOptions.value)}
        />
      )}
    </div>
  );
};

StyledDateInput.defaultProps = defaultStyledDateInputProps;

export default StyledDateInput;
