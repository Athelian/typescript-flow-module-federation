// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { VoyageIconStyle } from './style';

type Props = {
  transportType: ?string,
  color: string,
  disabled?: boolean,
  onClick: () => void,
};

const defaultProps = {
  disabled: false,
};

const VoyageIcon = ({ transportType, color, disabled = false, onClick }: Props) => {
  let icon = transportType === 'Air' ? 'fasPlane' : 'fasShip';
  if (!transportType) icon = 'fasUnknown';

  return (
    <button type="button" onClick={onClick} className={VoyageIconStyle(color, disabled)}>
      <Icon icon={icon} />
    </button>
  );
};

VoyageIcon.defaultProps = defaultProps;

export default VoyageIcon;
