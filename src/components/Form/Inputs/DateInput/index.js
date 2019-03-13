// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { Display } from 'components/Form';
import { formatToDateInput } from 'utils/date';
import FormattedDate from 'components/FormattedDate';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';

type Props = InputProps & {
  intl: IntlShape,
  color?: string,
};

const DateInput = ({
  intl,
  value,
  align,
  readOnly,
  readOnlyWidth,
  readOnlyHeight,
  placeholder,
  color,
  ...rest
}: Props) => {
  return readOnly ? (
    <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
      <FormattedDate value={value} />
    </Display>
  ) : (
    <input
      value={value ? formatToDateInput(value) : ''}
      style={{ textAlign: align, color }}
      placeholder={
        isNullOrUndefined(placeholder)
          ? intl.formatMessage(messages.defaultPlaceholder)
          : placeholder
      }
      {...rest}
      type="date"
    />
  );
};

DateInput.defaultProps = defaultInputProps;

export default injectIntl(DateInput);
