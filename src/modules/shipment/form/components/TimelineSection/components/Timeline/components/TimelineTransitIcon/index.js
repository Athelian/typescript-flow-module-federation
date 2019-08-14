/* eslint-disable jsx-a11y/control-has-associated-label */
// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
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
  arrivalLinkPath: string,
  departureLinkPath: string,
  arrivalTargetId: string,
  departureTargetId: string,
  boundaryId: string,
};

type Props = OptionalProps;

const defaultProps = {
  color: 'GRAY_LIGHT',
  arrivalLinkPath: '',
  departureLinkPath: '',
  arrivalTargetId: '',
  departureTargetId: '',
  boundaryId: '',
};

const TimelineTransitIcon = ({
  color,
  arrivalLinkPath,
  departureLinkPath,
  arrivalTargetId,
  departureTargetId,
  boundaryId,
}: Props) => {
  if (arrivalLinkPath && departureLinkPath) {
    return (
      <div className={TransitIconWrapperStyle}>
        <button
          className={TransitIconTopStyle}
          onClick={evt => {
            evt.stopPropagation();
            navigate(arrivalLinkPath);
          }}
          type="button"
        />
        <button
          className={TransitIconBottomStyle}
          to={departureLinkPath}
          onClick={evt => {
            evt.stopPropagation();
            navigate(departureLinkPath);
          }}
          type="button"
        />
        <div className={TimelineIconStyle(color)}>
          <Icon icon="TRANSIT" />
        </div>
      </div>
    );
  }

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
