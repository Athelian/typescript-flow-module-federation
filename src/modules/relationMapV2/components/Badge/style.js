import { css } from 'react-emotion';
import { colors, fontSizes, borderRadiuses } from 'styles/common';

export const BadgeWrapperStyle = css`
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: 1;
  padding: 1px 2px 1px 4px;
  ${borderRadiuses.MAIN};
  background-color: ${colors.TEAL_VERY_DARK};
  color: ${colors.WHITE};
  ${fontSizes.LITTLE};
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export default BadgeWrapperStyle;
