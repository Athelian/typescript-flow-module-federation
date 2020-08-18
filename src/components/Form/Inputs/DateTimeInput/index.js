// @flow
import React, { useCallback } from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { Display } from 'components/Form';
import { addTimezone, removeTimezone, formatDatetimeWithTimezoneToUTCDatetime } from 'utils/date';
import useUser from 'hooks/useUser';
import FormattedDateTZ from 'components/FormattedDateTZ';
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

  const handleBlur = useCallback(
    e => {
      if (onBlur) {
        onBlur({
          ...e,
          target: {
            ...e.target,
            value: addTimezone(e.target.value, user.timezone),
          },
        });
      }
    },
    [onBlur, user.timezone]
  );

  return readOnly ? (
    <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
      <FormattedDateTZ value={formatDatetimeWithTimezoneToUTCDatetime(value)} user={user} />
    </Display>
  ) : (
    <input
      ref={inputRef}
      value={removeTimezone(value)}
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
