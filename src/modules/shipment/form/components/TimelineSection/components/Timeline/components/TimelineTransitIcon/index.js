// @flow
import * as React from 'react';
import ScrollIntoView from 'components/ScrollIntoView';
import Icon from 'components/Icon';
import {
  TimelineIconStyle,
  TransitIconWrapperStyle,
  TransitIconTopStyle,
  TransitIconBottomStyle,
} from './style';

type OptionalProps = {
  color: string,
  arrivalTargetId: string,
  departureTargetId: string,
  boundaryId: string,
};

type Props = OptionalProps;

const defaultProps = {
  color: 'GRAY_LIGHT',
  arrivalTargetId: null,
  departureTargetId: null,
  boundaryId: null,
};

const TimelineTransitIcon = ({ color, arrivalTargetId, departureTargetId, boundaryId }: Props) => {
  if (arrivalTargetId && departureTargetId) {
    return (
      <div className={TransitIconWrapperStyle}>
        <ScrollIntoView targetId={arrivalTargetId} boundaryId={boundaryId}>
          <div className={TransitIconTopStyle} />
        </ScrollIntoView>
        <ScrollIntoView targetId={departureTargetId} boundaryId={boundaryId}>
          <div className={TransitIconBottomStyle} />
        </ScrollIntoView>
        <div className={TimelineIconStyle(color)}>
          <Icon icon="TRANSIT" />
        </div>
      </div>
    );
  }

  return (
    <div className={TransitIconWrapperStyle}>
      <div className={TransitIconTopStyle} />
      <div className={TransitIconBottomStyle} />
      <div className={TimelineIconStyle(color)}>
        <Icon icon="TRANSIT" />
      </div>
    </div>
  );
};

TimelineTransitIcon.defaultProps = defaultProps;

export default TimelineTransitIcon;
