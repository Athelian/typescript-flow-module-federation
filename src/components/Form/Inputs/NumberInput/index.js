// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Display } from 'components/Form';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { toFloat, toFloatNullable } from 'utils/number';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';

type OptionalProps = {
  nullable: boolean,
  nonNegative: boolean,
  readOnlySuffix: ?(string | React.Node),
};

type Props = OptionalProps &
  InputProps & {
    intl: IntlShape,
  };

export type NumberInputProps = Props;

const defaultProps = {
  ...defaultInputProps,
  nullable: false,
  nonNegative: true,
  readOnlySuffix: null,
};

export const defaultNumberInputProps = defaultProps;

class NumberInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleChange = (evt: any) => {
    const { onChange, nullable, nonNegative } = this.props;
    const value = nullable ? toFloatNullable(evt.target.value) : toFloat(evt.target.value);
    if (onChange) {
      const newValue = {
        ...evt,
        target: { value: nonNegative && !Number.isNaN(value) && value < 0 ? 0 : value },
      };
      onChange(newValue);
    }
  };

  render() {
    const {
      intl,
      value,
      align,
      readOnly,
      readOnlyWidth,
      readOnlyHeight,
      placeholder,
      nullable,
      onChange,
      nonNegative,
      readOnlySuffix,
      ...rest
    } = this.props;

    return readOnly ? (
      <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
        <FormattedNumber value={value} />
        {readOnlySuffix}
      </Display>
    ) : (
      <input
        value={value}
        style={{ textAlign: align }}
        placeholder={
          isNullOrUndefined(placeholder)
            ? intl.formatMessage(messages.defaultPlaceholder)
            : placeholder
        }
        {...rest}
        onChange={this.handleChange}
        type="number"
        spellCheck={false}
      />
    );
  }
}

export default injectIntl(NumberInput);
