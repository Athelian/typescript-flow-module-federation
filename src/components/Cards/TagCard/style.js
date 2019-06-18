// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, layout, fontSizes } from 'styles/common';

export const TagCardWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-template-columns: 195px;
  grid-gap: 5px;
  padding: 5px 0;
  height: 118px;
`;

export const TagWrapperStyle: string = css`
  display: flex;
  align-items: center;
  width: 175px;
  margin: 0 10px;
`;

export const TagDescriptionWrapperStyle: string = css`
  position: relative;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  padding: 0 10px;
  height: 35px;
  line-height: 20px;
  overflow: hidden;
`;

export const TagDescriptionFadeStyle: string = css`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom, ${colors.TRANSPARENT}, ${colors.WHITE});
`;

export const TagTypesWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  width: 100%;
  padding: 0 10px;
  justify-content: space-between;
`;

export const TagTypeStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  font-size: 11px;
`;
