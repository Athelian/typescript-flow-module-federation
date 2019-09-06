// @flow
import { css } from 'react-emotion';
import { borderRadiuses, layout } from 'styles/common';

export const ButtonStyle = css`
  ${borderRadiuses.MAIN};
`;

export const ModalWrapperStyle: string = css`
  position: relative;
  display: flex;
`;

export const GroupsWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const ActionsWrapperStyle: string = css`
  position: sticky;
  top: -100px;
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  width: 170px;
  padding: 20px 0;
  justify-items: center;
  & > button {
    width: 100px;
  }
`;
