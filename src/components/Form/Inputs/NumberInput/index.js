// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import FormattedNumber from 'components/FormattedNumber';
import BaseNumberInput from 'components/Inputs/NumberInput';
import { Display } from 'components/Form';

type OptionalProps = {
  nullable: boolean,
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
  readOnlySuffix: null,
};

export const defaultNumberInputProps = defaultProps;

class NumberInput extends React.Component<Props> {
  static defaultProps = defaultProps;

  render() {
    const {
      intl,
      value,
      align,
      readOnly,
      readOnlyWidth,
      readOnlyHeight,
      readOnlySuffix,
      placeholder,
      nullable,
      inputRef,
      ...rest
    } = this.props;

    return readOnly ? (
      <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
        <FormattedNumber value={value} />
        {readOnlySuffix}
      </Display>
    ) : (
      <BaseNumberInput
        ref={inputRef}
        value={value === null ? '' : value}
        style={{ textAlign: align }}
        placeholder={placeholder}
        {...rest}
      />
    );
  }
}

export default injectIntl(NumberInput);
