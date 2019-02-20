// @flow
import * as React from 'react';
import { formatToDateTimeInput } from 'utils/date';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

class DateTimeInput extends React.PureComponent<Props> {
  static defaultProps = defaultInputProps;

  render() {
    const { align, value, ...rest } = this.props;
    return (
      <input
        style={{ textAlign: align }}
        value={value ? formatToDateTimeInput(value) : ''}
        type="datetime-local"
        {...rest}
      />
    );
  }
}

export default DateTimeInput;
