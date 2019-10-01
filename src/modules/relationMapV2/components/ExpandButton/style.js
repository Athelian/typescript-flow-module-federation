// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

export const ExpandButtonStyle = (allIsExpanded: boolean): string => css`
  ${presets.BUTTON};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${borderRadiuses.MAIN};
  width: 30px;
  height: 30px;
  color: ${colors.GRAY_LIGHT};
  ${allIsExpanded ? fontSizes.MAIN : fontSizes.SMALL};
  &:hover {
    color: ${colors.BLUE};
    background-color: ${colors.GRAY_VERY_LIGHT};
    ${allIsExpanded ? fontSizes.SMALL : fontSizes.MAIN};
  }
  &:focus {
    color: ${colors.BLUE};
    background-color: ${colors.GRAY_VERY_LIGHT};
  }
`;

export default ExpandButtonStyle;
