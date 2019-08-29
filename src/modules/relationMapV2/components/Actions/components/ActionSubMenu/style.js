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
  bottom: 40px;
  right: -10px;
  ${transitions.EXPAND};
  overflow: hidden;
  padding: 0 10px;
  border-radius: 40px;
  ${isCollapsed
    ? `
    height: 0px;
    opacity: 0;
  `
    : `
    height: ${numOfButtons * 50 + 10}px;
    opacity: 1;
    &:hover {
      width: 220px;
    }
  `};
`;

export default ActionSubMenuWrapperStyle;
