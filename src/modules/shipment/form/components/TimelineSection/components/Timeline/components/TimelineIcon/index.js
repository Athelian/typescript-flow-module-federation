// @flow
import * as React from 'react';
import ScrollIntoView from 'components/ScrollIntoView';
import Icon from 'components/Icon';
import { TimelineIconStyle } from './style';

type OptionalProps = {
  icon: string,
  color: string,
  targetId: string,
  boundaryId: string,
};

type Props = OptionalProps;

const defaultProps = {
  icon: 'UNKNOWN',
  color: 'GRAY_LIGHT',
  targetId: null,
  boundaryId: null,
};

const TimelineIcon = ({ icon, color, targetId, boundaryId }: Props) => {
  if (targetId) {
    return (
      <ScrollIntoView targetId={targetId} boundaryId={boundaryId}>
        <div className={TimelineIconStyle({ icon, color })} role="presentation">
          <Icon icon={icon} />
        </div>
      </ScrollIntoView>
    );
  }
  return (
    <div className={TimelineIconStyle({ icon, color })} role="presentation">
      <Icon icon={icon} />
    </div>
  );
};

TimelineIcon.defaultProps = defaultProps;

export default TimelineIcon;
