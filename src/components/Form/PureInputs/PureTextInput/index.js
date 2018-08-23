// @flow
import * as React from 'react';
import {
  type PureInputProps as Props,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

export default class PureTextInput extends React.Component<Props> {
  static defaultProps = defaultPureInputProps;

  handleFocus = (event: any) => {
    const { setFocus, onFocus } = this.props;

    setFocus(true);
    if (onFocus) onFocus(event);
  };

  handleBlur = (event: any) => {
    const { setFocus, onBlur } = this.props;

    setFocus(false);
    if (onBlur) onBlur(event);
  };

  handleChange = (event: any) => {
    const { onChange } = this.props;

    if (onChange) onChange(event);
  };

  render() {
    const { align, setFocus, ...rest } = this.props;
    return (
      <input
        style={{ textAlign: align }}
        {...rest}
        type="text"
        spellCheck={false}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
      />
    );
  }
}
