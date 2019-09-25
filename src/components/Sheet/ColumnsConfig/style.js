// @flow
import { css } from 'react-emotion';
import { borderRadiuses, layout, shadows, colors } from 'styles/common';

export const ButtonStyle = css`
  ${borderRadiuses.MAIN};
`;

export const ModalWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const ActionsWrapperStyle: string = css`
  position: sticky;
  top: -100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${shadows.HEADER};
  background-color: ${colors.WHITE};
  height: 50px;
  padding: 0 20px;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 1;
`;

export const ButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
`;
