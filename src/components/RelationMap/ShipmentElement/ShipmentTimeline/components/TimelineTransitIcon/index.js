// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  TimelineIconStyle,
  TransitIconWrapperStyle,
  // TransitIconLeftStyle,
  // TransitIconRightStyle,
} from './style';

type OptionalProps = {
  color: string,
  arrivalTargetId: string,
  departureTargetId: string,
};

type Props = OptionalProps;

const defaultProps = {
  color: 'GRAY_LIGHT',
  arrivalTargetId: null,
  departureTargetId: null,
};

const TimelineTransitIcon = ({ color, arrivalTargetId, departureTargetId }: Props) => {
  if (arrivalTargetId && departureTargetId) {
    return (
      <div className={TransitIconWrapperStyle}>
        {/* <div className={TransitIconLeftStyle} /> */}
        {/* <div className={TransitIconRightStyle} /> */}
        <div className={TimelineIconStyle(color)}>
          <Icon icon="TRANSIT" />
        </div>
      </div>
    );
  }

  return (
    <div className={TransitIconWrapperStyle}>
      {/* <div className={TransitIconLeftStyle} /> */}
      {/* <div className={TransitIconRightStyle} /> */}
      <div className={TimelineIconStyle(color)}>
        <Icon icon="TRANSIT" />
      </div>
    </div>
  );
};

TimelineTransitIcon.defaultProps = defaultProps;

export default TimelineTransitIcon;
