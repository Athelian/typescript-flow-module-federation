// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';
import { TextAreaReadOnlyStyle } from './style';

type Props = InputProps & {
  intl: IntlShape,
};

const TextAreaInput = ({
  intl,
  value,
  align,
  readOnly,
  readOnlyWidth,
  readOnlyHeight,
  placeholder,
  ...rest
}: Props) =>
  readOnly ? (
    <div className={TextAreaReadOnlyStyle({ align, readOnlyWidth, readOnlyHeight })}>{value}</div>
  ) : (
    <textarea
      style={{ textAlign: align }}
      value={value || ''}
      placeholder={
        isNullOrUndefined(placeholder)
          ? intl.formatMessage(messages.defaultPlaceholder)
          : placeholder
      }
      {...rest}
      spellCheck={false}
    />
  );

TextAreaInput.defaultProps = defaultInputProps;

export default injectIntl(TextAreaInput);
