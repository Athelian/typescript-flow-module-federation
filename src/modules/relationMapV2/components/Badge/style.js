import { css } from 'react-emotion';
import { colors, fontSizes, borderRadiuses } from 'styles/common';

export const BadgeWrapperStyle = css`
  position: absolute;
  top: -7px;
  left: 5px;
  z-index: 2;
  padding: 0 2px 0 4px;
  ${borderRadiuses.MAIN};
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  ${fontSizes.LITTLE};
  letter-spacing: 2px;
  text-transform: uppercase;
  height: 14px;
  line-height: 14px;
`;

export default BadgeWrapperStyle;
