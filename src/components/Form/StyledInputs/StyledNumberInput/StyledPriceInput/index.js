// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import FormattedNumber from 'components/FormattedNumber';
import { PureNumberInput } from 'components/Form/PureInputs';
import { defaultPureNumberInputProps } from 'components/Form/PureInputs/PureNumberInput/type';
import { type StyledPriceInputProps as Props, defaultStyledPriceInputProps } from './type';
import { StyledPriceInputWrapperStyle, StyledPriceInputStyle, CurrencyStyle } from './style';

const StyledPriceInput = ({
  currency,
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
      className={StyledPriceInputWrapperStyle(
        isFocused,
        hasError,
        disabled,
        forceHoverStyle,
        width,
        height
      )}
    >
      {disabled ? (
        <Display align={pureInputOptions.align}>
          <FormattedNumber value={pureInputOptions.value} />
          {currency ? `${currency} ` : ''}
        </Display>
      ) : (
        <React.Fragment>
          <PureNumberInput {...mergedPureInputOptions} className={StyledPriceInputStyle} />
          <div className={CurrencyStyle}>{currency}</div>
        </React.Fragment>
      )}
    </div>
  );
};

StyledPriceInput.defaultProps = defaultStyledPriceInputProps;

export default StyledPriceInput;
