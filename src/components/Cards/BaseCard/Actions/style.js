// @flow
import { css } from 'react-emotion';
import { layout, transitions } from 'styles/common';

export const ActionsWrapperStyle = (visible: boolean) => css`
  position: absolute;
  bottom: 100%;
  right: 0;
  ${layout.GRID_HORIZONTAL};
  align-items: center;
  justify-content: end;
  grid-gap: 5px;
  overflow: hidden;
  ${visible
    ? `
      opacity: 1;
      height: 30px;
    `
    : `
      opacity: 0;
      height: 0px;
    `};
  ${transitions.EXPAND};
`;

export default ActionsWrapperStyle;
