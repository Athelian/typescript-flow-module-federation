// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureTextInput } from 'components/Form/PureInputs';
import { type StyledInputStates } from 'components/Form/StyledInputs/type';
import { type StyledTextInputProps as Props, defaultStyledTextInputProps } from './type';
import { StyledTextInputWrapperStyle, StyledTextInputStyle } from './style';

type State = StyledInputStates;

export default class StyledTextInput extends React.Component<Props, State> {
  static defaultProps = defaultStyledTextInputProps;

  state = {
    isFocused: false,
  };

  setFocus = (value: boolean) => {
    this.setState({ isFocused: value });
  };

  render() {
    const { hasError, disabled, forceHoverStyle, width, pureTextInputProps } = this.props;
    const { isFocused } = this.state;

    return (
      <div
        className={StyledTextInputWrapperStyle(
          isFocused,
          hasError,
          disabled,
          forceHoverStyle,
          width
        )}
      >
        {disabled ? (
          <Display align={pureTextInputProps.align}>{pureTextInputProps.value}</Display>
        ) : (
          <PureTextInput
            {...pureTextInputProps}
            className={StyledTextInputStyle}
            setFocus={this.setFocus}
          />
        )}
      </div>
    );
  }
}
