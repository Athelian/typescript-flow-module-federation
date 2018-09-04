// @flow
import * as React from 'react';
import { formatToDateInput } from 'utils/date';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

class DateInput extends React.Component<Props> {
  static defaultProps = defaultInputProps;

  handleChange = (evt: any) => {
    const { onChange } = this.props;

    if (onChange) {
      const dateEvent = { ...evt, target: { value: new Date(evt.target.value) } };
      onChange(dateEvent);
    }
  };

  render() {
    const { align, value, onChange, ...rest } = this.props;
    return (
      <input
        style={{ textAlign: align }}
        {...rest}
        onChange={this.handleChange}
        value={value ? formatToDateInput(value) : ''}
        type="date"
      />
    );
  }
}

export default DateInput;
