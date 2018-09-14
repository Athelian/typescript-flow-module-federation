// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  TimelineIconStyle,
  TransitIconWrapperStyle,
  TransitIconTopStyle,
  TransitIconBottomStyle,
} from './style';

type OptionalProps = {
  icon: string,
  color: string,
};

type Props = OptionalProps;

const defaultProps = {
  icon: 'UNKNOWN',
  color: 'GRAY_LIGHT',
};

const TimelineIcon = ({ icon, color }: Props) => {
  if (icon === 'TRANSIT') {
    return (
      <div className={TransitIconWrapperStyle}>
        <div className={TransitIconTopStyle} />
        <div className={TransitIconBottomStyle} />
        <div className={TimelineIconStyle({ icon, color })}>
          <Icon icon={icon} />
        </div>
      </div>
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
