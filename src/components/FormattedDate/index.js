// @flow
import * as React from 'react';
import { FormattedDate as FormattedDateIntl, FormattedRelative, FormattedTime } from 'react-intl';
import { isDataType } from 'utils/fp';

type Props = {
  value: ?string | ?Date,
  mode?: 'date' | 'date-no-year' | 'relative' | 'time' | 'time-relative' | 'datetime',
  timeFormat?: Object,
};

const FormattedDate = ({ value, mode = 'date', timeFormat }: Props) => {
  if (!value) return '';
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
    case 'relative':
      return <FormattedRelative value={isDataType(Date, value) ? value : new Date(value)} />;
    case 'datetime':
      return (
        <>
          <FormattedDateIntl value={isDataType(Date, value) ? value : new Date(value)} />{' '}
          <FormattedTime
            value={isDataType(Date, value) ? value : new Date(value)}
            {...timeFormat}
          />
        </>
      );
    case 'time':
      return <FormattedTime value={isDataType(Date, value) ? value : new Date(value)} />;
    case 'time-relative':
      return (
        <React.Fragment>
          <FormattedTime value={isDataType(Date, value) ? value : new Date(value)} />
          {` (`}
          <FormattedRelative value={isDataType(Date, value) ? value : new Date(value)} />
          {`)`}
        </React.Fragment>
      );
    default:
      return '';
  }
};

export default FormattedDate;
