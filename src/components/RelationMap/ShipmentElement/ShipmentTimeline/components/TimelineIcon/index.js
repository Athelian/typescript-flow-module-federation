// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { TimelineIconStyle } from './style';

type OptionalProps = {
  icon: string,
  color: string,
};

type Props = OptionalProps;

const defaultProps = {
  icon: 'UNKNOWN',
  color: 'GRAY_LIGHT',
};

const TimelineIcon = ({ icon, color }: Props) => (
  <div className={TimelineIconStyle({ icon, color })} role="presentation">
    <Icon icon={icon} />
  </div>
);

TimelineIcon.defaultProps = defaultProps;

export default TimelineIcon;
