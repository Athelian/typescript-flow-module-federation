// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { Display } from 'components/Form';
import {
  formatToDateTimeInput,
  formatDateObjectWithTimezoneToDatetimeInput,
  formatDatetimeInputToDateObjectWithTimezone,
} from 'utils/date';
import useUser from 'hooks/useUser';
import FormattedDate from 'components/FormattedDate';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';

type Props = InputProps & {
  intl: IntlShape,
};

const DateTimeInput = ({
  intl,
  value,
  align,
  readOnly,
  readOnlyWidth,
  readOnlyHeight,
  placeholder,
  inputRef,
  onBlur,
  ...rest
}: Props) => {
  const { user } = useUser();

  const handleBlur = e => {
    e.target.value = e.target.value ? formatToDateTimeInput(e.target.value) : '';
    if (onBlur) {
      onBlur({
        ...e,
        target: {
          ...e.target,
          value: formatDatetimeInputToDateObjectWithTimezone(e.target.value, user.timezone),
        },
      });
    }
  };

  return readOnly ? (
    <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
      <FormattedDate value={value} mode="datetime" />
    </Display>
  ) : (
    <input
      ref={inputRef}
      value={formatDateObjectWithTimezoneToDatetimeInput(value, user.timezone)}
      style={{ textAlign: align }}
      placeholder={
        isNullOrUndefined(placeholder)
          ? intl.formatMessage(messages.defaultPlaceholder)
          : placeholder
      }
      onBlur={handleBlur}
      {...rest}
      type="datetime-local"
    />
  );
};

DateTimeInput.defaultProps = defaultInputProps;

export default injectIntl(DateTimeInput);
