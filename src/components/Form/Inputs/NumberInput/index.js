// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { Display } from 'components/Form';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { toFloat, toFloatNullable } from 'utils/number';

type OptionalProps = {
  nullable: boolean,
};

type Props = OptionalProps & InputProps;

const defaultProps = {
  ...defaultInputProps,
  nullable: false,
};

class NumberInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleChange = (evt: any) => {
    const { onChange, nullable } = this.props;

    if (onChange) {
      const intEvent = {
        ...evt,
        target: { value: nullable ? toFloatNullable(evt.target.value) : toFloat(evt.target.value) },
      };
      onChange(intEvent);
    }
  };

  render() {
    const { value, align, readOnly, nullable, onChange, ...rest } = this.props;

    return readOnly ? (
      <Display style={{ textAlign: align }}>
        <FormattedNumber value={value} />
      </Display>
    ) : (
      <input
        value={value}
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
