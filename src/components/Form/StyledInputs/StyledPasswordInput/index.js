// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PurePasswordInput } from 'components/Form/PureInputs';
import { defaultPurePasswordInputProps } from 'components/Form/PureInputs/PurePasswordInput/type';
import { type StyledInputStates } from 'components/Form/StyledInputs/type';
import { type StyledPasswordInputProps as Props, defaultStyledPasswordInputProps } from './type';
import { StyledPasswordInputWrapperStyle, StyledPasswordInputStyle } from './style';

type State = StyledInputStates;

export default class StyledPasswordInput extends React.Component<Props, State> {
  static defaultProps = defaultStyledPasswordInputProps;

  state = {
    isFocused: false,
  };

  setFocus = (value: boolean) => {
    this.setState({ isFocused: value });
  };

  render() {
    const { hasError, disabled, forceHoverStyle, width, purePasswordInputOptions } = this.props;
    const { isFocused } = this.state;
    const mergedPurePasswordInputOptions = {
      ...defaultPurePasswordInputProps,
      ...purePasswordInputOptions,
    };

    return (
      <div
        className={StyledPasswordInputWrapperStyle(
          isFocused,
          hasError,
          disabled,
          forceHoverStyle,
          width
        )}
      >
        {disabled ? (
          <Display align={purePasswordInputOptions.align}>{purePasswordInputOptions.value}</Display>
        ) : (
          <PurePasswordInput
            {...mergedPurePasswordInputOptions}
            className={StyledPasswordInputStyle}
            setFocus={this.setFocus}
          />
        )}
      </div>
    );
  }
}
