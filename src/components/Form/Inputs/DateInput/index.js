// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { Display } from 'components/Form';
import {
  formatToDateInput,
  isValidDate,
  addTimezone,
  removeTimezone,
  hasTimezone,
  formatDatetimeWithTimezoneToUTCDatetime,
} from 'utils/date';
import useUser from 'hooks/useUser';
import FormattedDate from 'components/FormattedDate';
import FormattedDateTZ from 'components/FormattedDateTZ';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';

type Props = {|
  ...InputProps,
  required?: boolean,
  intl: IntlShape,
  color?: string,
|};

const DateInput = ({
  intl,
  value,
  align,
  readOnly,
  readOnlyWidth,
  readOnlyHeight,
  placeholder,
  color,
  inputRef,
  required,
  name,
  onChange,
  onBlur,
  onFocus,
  ...rest
}: Props) => {
  const { user } = useUser();

  const isTimezoneValue = React.useMemo(() => hasTimezone(value), [value]);

  const handleBlur2 = React.useCallback(
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

  const ref = React.useRef();
  React.useEffect(() => {
    if (isValidDate(value)) ref.current = value;
  }, [value]);
  const originalValue = ref.current || value;

  const handleBlur = evt => {
    if (required && onChange && !isValidDate(evt.target.value)) {
      // eslint-disable-next-line no-param-reassign
      evt.target.value = formatToDateInput(originalValue);
      onChange(evt);
      evt.persist();
      setTimeout(() => {
        if (onBlur)
          onBlur({
            ...evt,
            target: {
              ...evt.target,
              value: originalValue,
            },
          });
      }, 0);
    } else {
      // eslint-disable-next-line no-param-reassign
      evt.target.value = evt.target.value ? formatToDateInput(evt.target.value) : '';
      if (onBlur) onBlur(evt);
    }
  };

  if (isTimezoneValue) {
    return readOnly ? (
      <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
        <FormattedDateTZ value={formatDatetimeWithTimezoneToUTCDatetime(value)} user={user} />
      </Display>
    ) : (
      <input
        ref={inputRef}
        value={removeTimezone(value)}
        style={{ textAlign: align, color }}
        placeholder={
          isNullOrUndefined(placeholder)
            ? intl.formatMessage(messages.defaultPlaceholder)
            : placeholder
        }
        onBlur={handleBlur2}
        {...rest}
        type="date"
        onChange={onChange}
        onFocus={onFocus}
        name={name}
        required={required}
      />
    );
  }

  return readOnly ? (
    <Display align={align} width={readOnlyWidth} height={readOnlyHeight} color={color}>
      <FormattedDate value={value} />
    </Display>
  ) : (
    <input
      ref={inputRef}
      value={value ? formatToDateInput(value) : ''}
      style={{ textAlign: align, color }}
      placeholder={
        isNullOrUndefined(placeholder)
          ? intl.formatMessage(messages.defaultPlaceholder)
          : placeholder
      }
      onBlur={handleBlur}
      onChange={onChange}
      onFocus={onFocus}
      name={name}
      required={required}
      type="date"
      {...rest}
    />
  );
};

DateInput.defaultProps = defaultInputProps;

export default injectIntl(DateInput);
