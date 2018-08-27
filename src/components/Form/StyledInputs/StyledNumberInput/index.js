// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureNumberInput } from 'components/Form/PureInputs';
import { defaultPureNumberInputProps } from 'components/Form/PureInputs/PureNumberInput/type';
import { type StyledInputStates } from 'components/Form/StyledInputs/type';
import { type StyledNumberInputProps as Props, defaultStyledNumberInputProps } from './type';
import { StyledNumberInputWrapperStyle, StyledNumberInputStyle } from './style';

type State = StyledInputStates;

export default class StyledNumberInput extends React.Component<Props, State> {
  static defaultProps = defaultStyledNumberInputProps;

  state = {
    isFocused: false,
  };

  setFocus = (value: boolean) => {
    this.setState({ isFocused: value });
  };

  render() {
    const { hasError, disabled, forceHoverStyle, width, pureNumberInputOptions } = this.props;
    const { isFocused } = this.state;
    const mergedPureNumberInputOptiosn = {
      ...defaultPureNumberInputProps,
      ...pureNumberInputOptions,
    };

    return (
      <div
        className={StyledNumberInputWrapperStyle(
          isFocused,
          hasError,
          disabled,
          forceHoverStyle,
          width
        )}
      >
        {disabled ? (
          <Display align={pureNumberInputOptions.align}>{pureNumberInputOptions.value}</Display>
        ) : (
          <PureNumberInput
            {...mergedPureNumberInputOptiosn}
            className={StyledNumberInputStyle}
            setFocus={this.setFocus}
          />
        )}
      </div>
    );
  }
}
