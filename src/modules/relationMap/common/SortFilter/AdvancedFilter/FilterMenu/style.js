// @flow
import { css } from 'react-emotion';
import { scrollbars, colors } from 'styles/common';

export const FilterMenuWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  border-left: 1px solid ${colors.GRAY_VERY_LIGHT};
  border-right: 1px solid ${colors.GRAY_VERY_LIGHT};
`;

export default FilterMenuWrapperStyle;
