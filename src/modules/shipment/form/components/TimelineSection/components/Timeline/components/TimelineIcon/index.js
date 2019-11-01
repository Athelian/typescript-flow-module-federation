// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import scrollIntoView from 'utils/scrollIntoView';
import Icon from 'components/Icon';
import { TimelineIconStyle } from './style';

type OptionalProps = {
  icon: string,
  color: string,
  linkPath: string,
  targetId: string,
  boundaryId: string,
};

type Props = OptionalProps;

const defaultProps = {
  icon: 'UNKNOWN',
  color: 'GRAY_LIGHT',
  linkPath: '',
  targetId: '',
  boundaryId: '',
};

const TimelineIcon = ({ icon, color, linkPath, targetId, boundaryId }: Props) => {
  if (linkPath) {
    return (
      // $FlowFixMe Flow typed is not updated yet
      <Link
        className={TimelineIconStyle({ icon, color })}
        to={linkPath}
        onClick={evt => {
          evt.stopPropagation();
        }}
      >
        <Icon icon={icon} />
      </Link>
    );
  }
  if (targetId) {
    return (
      <button
        className={TimelineIconStyle({ icon, color })}
        onClick={() => scrollIntoView({ targetId, boundaryId })}
        type="button"
      >
        <Icon icon={icon} />
      </button>
    );
  }
  return (
    <div className={TimelineIconStyle({ icon, color })}>
      <Icon icon={icon} />
    </div>
  );
};

TimelineIcon.defaultProps = defaultProps;

export default TimelineIcon;
