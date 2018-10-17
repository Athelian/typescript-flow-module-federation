// @flow
import * as React from 'react';
import scrollIntoView from 'utils/scrollIntoView';
import Icon from 'components/Icon';
import { TimelineIconStyle } from './style';

type OptionalProps = {
  icon: string,
  color: string,
  targetId: string,
  boundaryId: string,
  size: string,
};

type Props = OptionalProps;

const defaultProps = {
  icon: 'UNKNOWN',
  color: 'GRAY_LIGHT',
  targetId: '',
  boundaryId: '',
  size: 'MAIN',
};

const TimelineIcon = ({ icon, color, targetId, boundaryId, size }: Props) => {
  if (targetId) {
    return (
      <button
        className={TimelineIconStyle({ icon, color, size })}
        onClick={() => scrollIntoView({ targetId, boundaryId })}
        type="button"
      >
        <Icon icon={icon} />
      </button>
    );
  }
  return (
    <div className={TimelineIconStyle({ icon, color, size })}>
      <Icon icon={icon} />
    </div>
  );
};

TimelineIcon.defaultProps = defaultProps;

export default TimelineIcon;
