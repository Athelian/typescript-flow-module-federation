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

const getTransportIcon = (transportType: ?string) => {
  if (transportType === 'Air') return 'PLANE';
  if (transportType === 'Ship') return 'SHIPMENT';
  return 'UNKNOWN';
};

const VoyageIcon = ({ transportType, color, disabled = false, onClick }: Props) => {
  const icon = getTransportIcon(transportType);

  return (
    <button type="button" onClick={onClick} className={VoyageIconStyle(color, disabled)}>
      <Icon icon={icon} />
    </button>
  );
};

VoyageIcon.defaultProps = defaultProps;

export default VoyageIcon;
