import { css } from 'react-emotion';
import { layout, scrollbars, borderRadiuses } from 'styles/common';

export const BatchListWrapperStyle = css`
  position: relative;
  width: 100%;
  height: min-content;
  padding: 20px;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  overflow: hidden;
  ${scrollbars.SMALL};
  &:hover {
    overflow-y: hidden;
    overflow-x: auto;
  }
`;

export default null;
