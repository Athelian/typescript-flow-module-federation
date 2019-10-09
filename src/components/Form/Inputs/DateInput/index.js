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
  inputRef,
  onBlur,
  ...rest
}: Props) => {
  const handleBlur = e => {
    if (onBlur) {
      onBlur(e);
      e.target.value = e.target.value ? formatToDateInput(e.target.value) : '';
    }
  };
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
      {...rest}
      type="date"
    />
  );
};

DateInput.defaultProps = defaultInputProps;

export default injectIntl(DateInput);
