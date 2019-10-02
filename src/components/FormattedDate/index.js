// @flow
import * as React from 'react';
import {
  FormattedDate as FormattedDateIntl,
  FormattedRelativeTime,
  FormattedTime,
  FormattedMessage,
} from 'react-intl';
import { isDataType } from 'utils/fp';

type Props = {
  value: ?string | ?Date,
  mode?: 'date' | 'date-no-year' | 'relative' | 'time' | 'datetime',
};

const FormattedDate = ({ value, mode = 'date' }: Props) => {
  if (!value) return <FormattedMessage id="components.cards.na" defaultMessage="N/A" />;
  switch (mode) {
    case 'date':
      return <FormattedDateIntl value={isDataType(Date, value) ? value : new Date(value)} />;
    case 'date-no-year':
      return (
        <FormattedDateIntl
          value={isDataType(Date, value) ? value : new Date(value)}
          month="2-digit"
          day="2-digit"
        />
      );
    case 'relative': {
      let number;
      if (isDataType(Date, value)) {
        number = (value.getTime() - Date.now()) / 1000;
      } else {
        number = (new Date(value).getTime() - Date.now()) / 1000;
      }
      if (number !== undefined) {
        return <FormattedRelativeTime value={number} updateIntervalInSeconds={1} />;
      }
      return null;
    }

    case 'datetime':
      return (
        <>
          <FormattedDateIntl value={isDataType(Date, value) ? value : new Date(value)} />{' '}
          <FormattedTime value={isDataType(Date, value) ? value : new Date(value)} />
        </>
      );
    case 'time':
      return <FormattedTime value={isDataType(Date, value) ? value : new Date(value)} />;

    default:
      return '';
  }
};

export default FormattedDate;
