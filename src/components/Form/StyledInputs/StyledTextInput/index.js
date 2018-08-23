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

  setFocus = (value: boolean) => {
    this.setState({ isFocused: value });
  };

  render() {
    const {
      hasError = false,
      disabled = false,
      forceHoverStyle = false,
      width = '100%',
      ...pureTextInputProps
    } = this.props;
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

StyledTextInput.defaultProps = styledInputDefaultProps;

export default StyledTextInput;
