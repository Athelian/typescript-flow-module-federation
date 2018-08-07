// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { TimelineIconStyle } from './style';

type Props = {
  icon: string,
  color: string,
  ring?: boolean,
  disabled?: boolean,
  onClick: () => void,
};

const defaultProps = {
  ring: false,
  disabled: false,
};

const TimelineIcon = ({ icon, color, ring = true, disabled = false, onClick }: Props) => (
  <button type="button" onClick={onClick} className={TimelineIconStyle(color, ring, disabled)}>
    <Icon icon={icon} />
  </button>
);

TimelineIcon.defaultProps = defaultProps;

export default TimelineIcon;
