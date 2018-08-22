// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureTextInput } from 'components/Form/PureInputs';
import {
  type StyledInputProps as Props,
  styledInputDefaultProps,
  type StyledInputStates,
} from 'components/Form/StyledInputs/type';
import { StyledTextInputWrapperStyle, StyledTextInputStyle } from './style';

type State = StyledInputStates;

class StyledTextInput extends React.Component<Props, State> {
  static defaultProps = styledInputDefaultProps;

  state = {
    isFocused: false,
  };

  setFocus = () => {
    this.setState({ isFocused: true });
  };

  setBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { hasError, disabled, forceHoverStyle, ...pureTextInputProps } = this.props;
    const { isFocused } = this.state;

    return (
      <div
        className={StyledTextInputWrapperStyle(
          isFocused,
          !!hasError,
          !!disabled,
          !!forceHoverStyle
        )}
      >
        {disabled ? (
          <Display align={pureTextInputProps.align}>{pureTextInputProps.value}</Display>
        ) : (
          <PureTextInput
            {...pureTextInputProps}
            className={StyledTextInputStyle}
            setFocus={this.setFocus}
            setBlur={this.setBlur}
          />
        )}
      </div>
    );
  }
}

StyledTextInput.defaultProps = styledInputDefaultProps;

export default StyledTextInput;
