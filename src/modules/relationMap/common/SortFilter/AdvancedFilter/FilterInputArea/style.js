// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const FilterInputAreaWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export default FilterInputAreaWrapperStyle;
