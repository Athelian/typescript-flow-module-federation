// @flow
import React from 'react';
import FormattedDate from 'components/FormattedDate';
import { cx } from 'react-emotion';
import { ContainerDateStyle } from './style';
import { DateStyle } from '../TimelineDate/style';

type Props = {
  timelineDates?: Array<Object>,
  type: 'Agreed' | 'Actual',
};
const defaultProps = {
  timelineDates: [],
};
const TimelineContainerDate = (props: Props) => {
  const { timelineDates = [], type } = props;
  if (timelineDates && timelineDates.length === 1) {
    const [timelineDate] = timelineDates;
    return (
      <div
        className={cx(DateStyle({ shownDate: true, vertical: false }), ContainerDateStyle(type))}
      >
        <FormattedDate value={timelineDate[`warehouseArrival${type}Date`]} />
      </div>
    );
  }
  const dates = timelineDates.map(timelineDate =>
    new Date(timelineDate[`warehouseArrival${type}Date`]).getTime()
  );
  const maxDate = new Date(Math.max.apply(null, dates));
  const minDate = new Date(Math.min.apply(null, dates));
  return (
    <div style={{ display: 'flex' }}>
      <div
        className={cx(DateStyle({ shownDate: true, vertical: false }), ContainerDateStyle(type))}
      >
        <FormattedDate value={minDate} /> -
      </div>
      <div
        className={cx(DateStyle({ shownDate: true, vertical: false }), ContainerDateStyle(type))}
      >
        <FormattedDate value={maxDate} />
      </div>
    </div>
  );
};
TimelineContainerDate.defaultProps = defaultProps;
export default TimelineContainerDate;
