import { css } from 'react-emotion';
import { borderRadiuses, colors, shadows, transitions, fontSizes } from 'styles/common';

export const IconWrapperStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  color: ${colors.WHITE};
  background-color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  ${transitions.EXPAND};
  ${borderRadiuses.CIRCLE};
  &:hover,
  :focus {
    background-color: ${colors.TEAL};
    ${shadows.NAV_BUTTON};
  }
`;

export default IconWrapperStyle;
