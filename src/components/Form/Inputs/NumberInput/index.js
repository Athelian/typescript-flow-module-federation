// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import FormattedNumber from 'components/FormattedNumber';
import { Display } from 'components/Form';
import { toFloatNullable } from 'utils/number';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';

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

  handleChange = (evt: any) => {
    const { onChange } = this.props;

    if (onChange) {
      if (evt.target.value < 0) {
        return;
      }
      onChange({
        ...evt,
        target: {
          ...evt.target,
          value: toFloatNullable(evt.target.value),
        },
      });
    }
  };

  handleBlur = (evt: any) => {
    const { onBlur, nullable } = this.props;

    if (!nullable && evt.target.value === '') {
      if (onBlur) {
        onBlur({
          ...evt,
          target: {
            ...evt.target,
            value: 0,
          },
        });
      }

      // eslint-disable-next-line no-param-reassign
      evt.target.value = 0;
    } else {
      const value = toFloatNullable(evt.target.value);

      if (onBlur) {
        onBlur({
          ...evt,
          target: {
            ...evt.target,
            value,
          },
        });
      }

      // eslint-disable-next-line no-param-reassign
      evt.target.value = value;
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
      readOnlySuffix,
      placeholder,
      nullable,
      onChange,
      onBlur,
      inputRef,
      ...rest
    } = this.props;

    return readOnly ? (
      <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
        <FormattedNumber value={value} />
        {readOnlySuffix}
      </Display>
    ) : (
      <input
        ref={inputRef}
        value={value === null ? '' : value}
        style={{ textAlign: align }}
        placeholder={
          isNullOrUndefined(placeholder)
            ? intl.formatMessage(messages.defaultPlaceholder)
            : placeholder
        }
        {...rest}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        type="number"
        spellCheck={false}
      />
    );
  }
}

export default injectIntl(NumberInput);
