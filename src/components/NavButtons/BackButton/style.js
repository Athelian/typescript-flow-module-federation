import { css } from 'react-emotion';
import { presets, shadows, colors, borderRadiuses } from 'styles/common';

export const BackButtonStyle = css`
  ${presets.BUTTON};
  background-color: #fff;
  ${borderRadiuses.CIRCLE};
  ${shadows.NAV_BUTTON};
  height: 40px;
  width: 40px;
  font-size: 20px;
  color: ${colors.GRAY};
  border: 2px solid ${colors.TRANSPARENT};
  margin: 0 10px 0 0;
  flex-shrink: 0;
  &:hover {
    background-color: #fafafa;
    transform: translateY(-1px);
    ${shadows.NAV_BUTTON_HOVER};
  }
  &:focus {
    border-color: ${colors.TEAL};
  }
`;

export default BackButtonStyle;
