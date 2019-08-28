// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { Display } from 'components/Form';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';

type Props = InputProps & {
  intl: IntlShape,
};

const TextInput = ({
  intl,
  value,
  align,
  readOnly,
  readOnlyWidth,
  readOnlyHeight,
  placeholder,
  inputRef,
  ...rest
}: Props) =>
  readOnly ? (
    <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
      {value}
    </Display>
  ) : (
    <input
      ref={inputRef}
      value={value}
      style={{ textAlign: align }}
      placeholder={
        isNullOrUndefined(placeholder)
          ? intl.formatMessage(messages.defaultPlaceholder)
          : placeholder
      }
      {...rest}
      type="text"
      spellCheck={false}
    />
  );

TextInput.defaultProps = defaultInputProps;

export default injectIntl(TextInput);
