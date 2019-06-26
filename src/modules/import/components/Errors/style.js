// @flow
import { css } from 'react-emotion';
import { fontSizes, layout, colors, borderRadiuses } from 'styles/common';

export const ContainerStyle: string = css`
  ${layout.VERTICAL};
  ${borderRadiuses.MAIN};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 170px;
  margin-top: 20px;
  padding: 10px 10px 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const TitleStyle = (count: number): string => css`
  ${fontSizes.MEDIUM};
  letter-spacing: 0.2em;
  color: ${count > 0 ? colors.GRAY_DARK_1 : colors.GRAY_LIGHT};
`;

export const ErrorsStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  flex: 1;
  overflow-x: auto;
  width: 100%;
  margin-top: 10px;
`;

export const ErrorStyle: string = css`
  ${layout.HORIZONTAL};
  ${borderRadiuses.BUTTON};
  align-items: center;
  background-color: ${colors.WHITE};
  padding: 0 10px;
`;

export const IconStyle: string = css`
  font-size: 11px;
  color: ${colors.RED};
`;

export const MessageStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  margin-left: 10px;
`;
