import { css } from 'react-emotion';
import { layout, colors } from 'styles/common';

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
export default null;
