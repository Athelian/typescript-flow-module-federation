// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, layout, transitions } from 'styles/common';

export const ExpandButtonsWrapperStyle: string = css`
  display: flex;
  background: ${colors.GRAY_SUPER_LIGHT};
  font-size: 14px;
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};
  cursor: pointer;
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    background: ${colors.GRAY_VERY_LIGHT};
    color: ${colors.GRAY_DARK};
    & > :nth-child(2) {
      color: ${colors.TEAL};
    }
  }
`;

export const IconStyle: string = css`
  width: 25px;
  height: 30px;
  display: flex;
  ${layout.CENTER_CENTER};
`;
