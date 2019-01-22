import { css } from 'react-emotion';
import { borderRadiuses, colors, shadows, transitions } from 'styles/common';

export const IconWrapperStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  color: ${colors.WHITE};
  background-color: ${colors.GRAY_LIGHT};
  ${transitions.EXPAND};
  ${borderRadiuses.CIRCLE};
  &:hover,
  :focus {
    background-color: ${colors.TEAL};
    ${shadows.NAV_BUTTON};
  }
`;

export default IconWrapperStyle;
