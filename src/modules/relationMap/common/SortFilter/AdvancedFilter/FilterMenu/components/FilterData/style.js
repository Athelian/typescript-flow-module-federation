// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, borderRadiuses } from 'styles/common';

export const FilterDataWrapperStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  padding: 0 5px 0 35px;
  width: 100%;
`;

export const FilterDataStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  padding: 0 5px 0 10px;
  margin: 0 5px 10px 5px;
  height: 20px;
  ${fontSizes.SMALL};
  line-height: 20px;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_DARK};
  }
`;
