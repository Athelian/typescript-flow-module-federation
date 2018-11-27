import { css } from 'react-emotion';
import { layout, colors, borderRadiuses } from 'styles/common';

export const OverlayStyle = css`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: ${colors.TRANSPARENT};
`;

export const CenteredStyle = css`
  ${layout.LAYOUT};
  ${layout.JUSTIFIED_CENTER};
  ${layout.CENTER};
`;

export const LabelStyle = css`
  ${layout.LAYOUT};
  ${layout.JUSTIFIED_CENTER};
  ${layout.CENTER};

  ${borderRadiuses.MAIN};
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
`;
export const LabelShipmentStyle = css`
  ${LabelStyle};
  width: 180px;
  height: 40px;
`;

export const CenteredOrderStyle = css`
  ${CenteredStyle};
  width: 100%;
  height: 100%;

  background-color: ${colors.TEAL};
`;
export default null;
