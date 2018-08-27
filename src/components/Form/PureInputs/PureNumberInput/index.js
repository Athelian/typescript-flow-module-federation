// @flow
import * as React from 'react';
import { type PureInputRequiredProps } from 'components/Form/PureInputs/type';
import { type PureNumberInputProps, defaultPureNumberInputProps } from './type';

type Props = PureNumberInputProps & PureInputRequiredProps;

export default class PureNumberInput extends React.Component<Props> {
  static defaultProps = defaultPureNumberInputProps;

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
        type="number"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
      />
    );
  }
}
