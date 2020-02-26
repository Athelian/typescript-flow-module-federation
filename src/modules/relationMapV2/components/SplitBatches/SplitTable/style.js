// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const SplitTableWrapperStyle: string = css`
  display: flex;
`;

export const LeftSideWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

export const LeftTableWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: auto;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 100%;
  border-right: 2px solid ${colors.GRAY_LIGHT};
  padding: 0 0 10px 0;
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

export const RightTitleStyle: string = css`
  padding: 0 0 0 20px;
`;

export const RightTableWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 100%;
  padding: 0 0 10px 20px;
`;

export const RightRowStyle: string = css`
  display: grid;
  grid-template-rows: 30px;
  grid-template-columns: 200px 150px;
  grid-gap: 20px;
`;
