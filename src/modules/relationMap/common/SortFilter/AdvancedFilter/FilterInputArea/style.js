// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const FilterInputAreaWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export default FilterInputAreaWrapperStyle;
