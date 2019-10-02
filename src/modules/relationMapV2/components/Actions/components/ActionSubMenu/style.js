// @flow
import { css } from 'react-emotion';
import { layout, transitions } from 'styles/common';

export const ActionSubMenuWrapperStyle = (isCollapsed: boolean, numOfButtons: number) => css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  grid-template-column: 50px;
  width: 60px;
  align-content: center;
  justify-items: end;
  position: absolute;
  right: -10px;
  ${transitions.EXPAND};
  padding: 0 10px;
  height: ${numOfButtons * 50 + 10}px;
  ${isCollapsed
    ? `
    opacity: 0;
    top: 70px;
  `
    : `
    opacity: 1;
    bottom: 40px;
  `};
`;

export default ActionSubMenuWrapperStyle;
