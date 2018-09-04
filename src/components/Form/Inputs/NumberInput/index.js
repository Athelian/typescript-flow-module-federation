// @flow
import * as React from 'react';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

class NumberInput extends React.Component<Props> {
  static defaultProps = defaultInputProps;

  handleChange = (evt: any) => {
    const { onChange } = this.props;

    if (onChange) {
      const intEvent = { ...evt, target: { value: parseInt(evt.target.value, 10) } };
      onChange(intEvent);
    }
  };

  render() {
    const { align, onChange, ...rest } = this.props;
    return (
      <input
        style={{ textAlign: align }}
        {...rest}
        onChange={this.handleChange}
        type="number"
        spellCheck={false}
      />
    );
  }
}

export default NumberInput;
