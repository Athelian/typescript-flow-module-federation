// @flow
import * as React from 'react';
import scrollIntoView from 'utils/scrollIntoView';
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
        <button
          className={TransitIconTopStyle}
          onClick={() => scrollIntoView({ targetId: arrivalTargetId, boundaryId })}
          type="button"
        />
        <button
          className={TransitIconBottomStyle}
          onClick={() => scrollIntoView({ targetId: departureTargetId, boundaryId })}
          type="button"
        />
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
