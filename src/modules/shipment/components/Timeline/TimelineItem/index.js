// @flow
import * as React from 'react';
import type { TimelineDate as TimelineDateType } from 'modules/shipment/type.js.flow';
import TimelineIcon from '../TimelineIcon';
import TimelineDate from '../TimelineDate';
import HorizontalLine from '../HorizontalLine';
import VoyageIcon from '../VoyageIcon';
import { TimelineItemWrapperStyle, HeaderStyle, IconWrapperStyle } from './style';

type Props = {
  header?: ?string | ?React.Node,
  icon: string,
  timelineDate: TimelineDateType,
  color: string,
  align: 'left' | 'right',
  showVoyageIcon?: boolean,
  transportType?: ?string,
  portIndex?: ?number,
  onClick: number => void,
};

const defaultProps = {
  header: null,
  showVoyageIcon: false,
  transportType: null,
  portIndex: null,
};

const TimelineItem = ({
  header,
  icon,
  timelineDate,
  color,
  align,
  showVoyageIcon = false,
  transportType,
  portIndex,
  onClick,
}: Props) => (
  <div className={TimelineItemWrapperStyle}>
    <div className={HeaderStyle(align)}>{header}</div>
    <div className={IconWrapperStyle}>
      {align === 'right' && <HorizontalLine color={color} />}
      <TimelineIcon
        icon={icon}
        color={color}
        onClick={() => (portIndex ? onClick(portIndex) : onClick(-1))}
      />
      {align === 'left' && <HorizontalLine color={color} />}
      {align === 'left' &&
        showVoyageIcon && (
          <VoyageIcon
            transportType={transportType}
            color={color}
            onClick={() => (portIndex ? onClick(portIndex + 1) : onClick(-1))}
          />
        )}
    </div>
    <TimelineDate timelineDate={timelineDate} align={align} />
  </div>
);

TimelineItem.defaultProps = defaultProps;

export default TimelineItem;
