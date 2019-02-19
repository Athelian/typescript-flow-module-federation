// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes } from 'styles/common';

export const HighlightBarWrapper: string = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  padding: 0 10px;
  background-color: ${colors.HIGHLIGHT};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  ${transitions.EXPAND};
`;
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
  padding: 0 10px;
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
  margin-right: 5px;

  ${fontSizes.HUGE};
  cursor: pointer;
  user-select: none;
  color: ${colors.TEAL_QUITE_DARK};
  &:hover {
    color: ${colors.TEAL};
  }
`;

export const HighlightLabelStyle: string = css`
  margin-right: 50px;
  padding: 0;
  color: ${colors.ORDER_ITEM_VERY_DARK};
  font-weight: bold;
`;

export const CancelHighlightButton = css`
  margin-right: 5px;

  ${fontSizes.HUGE};
  cursor: pointer;
  user-select: none;
  color: ${colors.ORDER_ITEM_VERY_DARK};
  &:hover {
    color: ${colors.HIGHLIGHT_DARK};
  }
`;

const getHighlightColor = (active: boolean) =>
  active ? colors.ORDER_ITEM_VERY_DARK : colors.GRAY_DARK;
const getItemColor = (active: boolean) => (active ? colors.TEAL_VERY_DARK : colors.GRAY_DARK);

export const ItemHighlightWrapper = (active: boolean) => css`
  color: ${getHighlightColor(active)};
`;

export const IconHighlightWrapper = (active: boolean) => css`
  margin-right: 20px;
  color: ${getHighlightColor(active)};
`;

export const ItemWrapper = (active: boolean) => css`
  color: ${getItemColor(active)};
`;

export const IconWrapper = (active: boolean) => css`
  margin-right: 20px;
  color: ${getItemColor(active)};
`;

export const TabItemStyled: string = css`
  color: ${colors.TEAL_VERY_DARK};
  &:hover,
  &:focus {
    color: ${colors.TEAL_VERY_DARK};
    & > span {
      background-color: ${colors.TEAL_VERY_DARK};
    }
  }
`;

export const LoadingContainerStyle: string = css`
  padding: 50px 20px;
`;

export const MoveToWrapper: string = css`
  display: flex;
  align-items: center;
`;
