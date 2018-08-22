// @flow
import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';
import {
  type PureInputProps as Props,
  pureInputDefaultProps,
} from 'components/Form/PureInputs/type';

class PureTextInput extends React.Component<Props> {
  static defaultProps = pureInputDefaultProps;

  handleFocus = () => {
    const { setFocus, onFocus } = this.props;

    setFocus();
    if (onFocus) {
      onFocus();
    }
  };

  handleBlur = () => {
    const { setBlur, onBlur } = this.props;

    setBlur();
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { align, setFocus, setBlur, ...rest } = this.props;
    return (
      <DebounceInput
        style={{ textAlign: align }}
        {...rest}
        type="text"
        spellCheck={false}
        debounceTimeout={500}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  }
}

PureTextInput.defaultProps = pureInputDefaultProps;

export default PureTextInput;
