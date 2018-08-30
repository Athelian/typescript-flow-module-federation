// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, layout, transitions } from 'styles/common';

export const ExpandButtonsWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px;
`;

export const ExpandButtonStyle = css`
  display: flex;
  background: ${colors.GRAY_SUPER_LIGHT};
  font-size: 14px;
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};
  cursor: pointer;
  color: ${colors.GRAY_LIGHT};
  &:hover {
    background: ${colors.GRAY_VERY_LIGHT};
    color: ${colors.GRAY_DARK};
  }
`;

export const IconStyle = css`
  width: 25px;
  height: 30px;
  display: flex;
  ${layout.CENTER_CENTER};
`;
