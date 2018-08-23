// @flow
import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';
import {
  type PureInputProps as Props,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

export default class PureTextInput extends React.Component<Props> {
  static defaultProps = defaultPureInputProps;

  handleFocus = () => {
    const { setFocus, onFocus } = this.props;

    setFocus(true);
    onFocus();
  };

  handleBlur = () => {
    const { setFocus, onBlur } = this.props;

    setFocus(false);
    onBlur();
  };

  render() {
    const { align, setFocus, ...rest } = this.props;
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
