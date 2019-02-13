// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Display } from 'components/Form';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { toFloat, toFloatNullable } from 'utils/number';
import { DaysWrapperStyle } from './style';

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
      const newValue = {
        ...evt,
        target: { value: nullable ? toFloatNullable(evt.target.value) : toFloat(evt.target.value) },
      };
      onChange(newValue);
    }
  };

  render() {
    const {
      value,
      align,
      readOnly,
      readOnlyWidth,
      readOnlyHeight,
      nullable,
      onChange,
      ...rest
    } = this.props;

    return readOnly ? (
      <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
        <FormattedNumber value={value} />{' '}
        <FormattedMessage id="components.inputs.days" defaultMessage="Days" />
      </Display>
    ) : (
      <>
        <input
          value={value}
          style={{ textAlign: align }}
          {...rest}
          onChange={this.handleChange}
          type="number"
          spellCheck={false}
        />
        <div className={DaysWrapperStyle({ height: readOnlyHeight, align })}>
          <FormattedMessage id="components.inputs.days" defaultMessage="Days" />
        </div>
      </>
    );
  }
}

export default NumberInput;
