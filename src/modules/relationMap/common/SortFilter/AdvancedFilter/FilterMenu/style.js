// @flow
import { css } from 'react-emotion';
import { shadows, scrollbars } from 'styles/common';

export const FilterMenuWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 400px;
  overflow: hidden;
  ${scrollbars.SMALL};
  ${shadows.HEADER_RIGHT};
  &:hover {
    overflow-x: hidden;
    overflow-y: overlay;
  }
`;

export default FilterMenuWrapperStyle;
