// @flow
import * as React from 'react';
import { formatToDateInput } from 'utils/date';
import { type InputProps as Props, defaultInputProps } from 'components/Form/Inputs/type';

class DateInput extends React.PureComponent<Props> {
  static defaultProps = defaultInputProps;

  render() {
    const { align, value, ...rest } = this.props;
    return (
      <input
        style={{ textAlign: align }}
        value={value ? formatToDateInput(value) : ''}
        type="date"
        {...rest}
      />
    );
  }
}

export default DateInput;
