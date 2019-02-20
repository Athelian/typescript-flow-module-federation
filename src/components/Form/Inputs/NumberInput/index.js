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
};

type Props = OptionalProps &
  InputProps & {
    intl: IntlShape,
  };

export type NumberInputProps = Props;

const defaultProps = {
  ...defaultInputProps,
  nullable: false,
};

export const defaultNumberInputProps = defaultProps;

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
      intl,
      value,
      align,
      readOnly,
      readOnlyWidth,
      readOnlyHeight,
      placeholder,
      nullable,
      onChange,
      ...rest
    } = this.props;

    return readOnly ? (
      <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
        <FormattedNumber value={value} />
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
