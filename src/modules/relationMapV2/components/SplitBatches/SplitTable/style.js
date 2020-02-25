// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const SplitTableWrapperStyle: string = css`
  display: flex;
  width: 800px;
`;

export const LeftSideWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 400px;
`;

export const LeftTableWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: auto;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 100%;
`;

export const LeftRowStyle: string = css`
  display: grid;
  grid-template-rows: 30px;
  grid-template-columns: repeat(7, 200px);
`;

export const TableCellStyle: string = css`
  background-color: ${colors.WHITE};
  border-bottom: 1px solid ${colors.GRAY_SUPER_LIGHT};
`;

export const RightSideWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 400px;
`;

export const RightTableWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 100%;
`;

export const RightRowStyle: string = css`
  display: grid;
  grid-template-rows: 30px;
  grid-template-columns: repeat(2, 200px);
`;
