// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, borderRadiuses } from 'styles/common';

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

export default FilterDataStyle;
