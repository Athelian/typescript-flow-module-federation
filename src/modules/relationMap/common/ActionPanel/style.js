// @flow
import { css } from 'react-emotion';
import { colors, transitions } from 'styles/common';

export const ActionSection1WrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* width: 100%; */
  height: 50px;
  padding: 0 10px;
  background-color: ${colors.TEAL_HALF};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  ${transitions.EXPAND};
`;

export const ActionSection2WrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  background: ${colors.GRAY_SUPER_LIGHT};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  ${transitions.EXPAND};
`;

export const ActionsSelectedStyle: string = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ActionSelectedLabelStyle: string = css`
  margin-right: 50px;
  padding: 0;
  color: ${colors.TEAL_VERY_DARK};
  font-weight: bold;
`;

const ChildrenGrid = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  grid-template-rows: 50px;
  align-items: center;
`;
export const ChildrenWrapperStyle: string = css`
  ${ChildrenGrid} grid-gap: 20px;
`;

export const SelectedWrapperStyle: string = css`
  ${ChildrenGrid} grid-gap: 5px;
`;

export const TabItemWrapperStyle = css`
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const CancelButtonStyle = css`
  cursor: pointer;
  user-select: none;
  color: ${colors.TEAL_QUITE_DARK};
  &:hover {
    color: ${colors.TEAL};
  }
`;
