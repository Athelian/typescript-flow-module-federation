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

export const HeaderStyle: string = css`
  ${layout.VERTICAL};
  position: sticky;
  top: -100px;
  z-index: 1;
`;

export const ActionsWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${shadows.HEADER};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  z-index: 2;
`;

export const ButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
`;

export const TemplateWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${shadows.HEADER};
  background-color: ${colors.GRAY_VERY_LIGHT};
  position: sticky;
  height: 50px;
  padding: 10px 20px;
  justify-content: space-between;
`;

export const TemplateSelectWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 15px;
`;
