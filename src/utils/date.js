// @flow
// $FlowFixMe flow not yet configured
import format from 'date-fns/format';

export const formatDateTimeToDate = (date: Date): string => format(date, 'YYYY-MM-DD');
export default formatDateTimeToDate;
