// @flow
import * as React from 'react';
import Display from 'components/Form/Display';
import { PureTextInput } from 'components/Form/PureInputs';
import {
  type StyledInputProps as Props,
  defaultStyledInputProps,
  type StyledInputStates,
} from 'components/Form/StyledInputs/type';
import { StyledTextInputWrapperStyle, StyledTextInputStyle } from './style';

type State = StyledInputStates;

export default class StyledTextInput extends React.Component<Props, State> {
  static defaultProps = defaultStyledInputProps;

  state = {
    isFocused: false,
  };

  setFocus = (value: boolean) => {
    this.setState({ isFocused: value });
  };

  render() {
    const { hasError, disabled, forceHoverStyle, width, pureInputProps } = this.props;
    const { isFocused } = this.state;
    pureInputProps.setFocus = this.setFocus;

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
          <Display align={pureInputProps.align}>{pureInputProps.value}</Display>
        ) : (
          <PureTextInput {...pureInputProps} className={StyledTextInputStyle} />
        )}
      </div>
    );
  }
}
