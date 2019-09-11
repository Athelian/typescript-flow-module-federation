// @flow
import { css } from 'react-emotion';
import { scrollbars, fontSizes, colors } from 'styles/common';

export const OrderListWrapperStyle: string = css`
  grid-column: span 3;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  min-height: 0;
`;

export const OrderListBodyStyle: string = css`
  display: grid;
  grid-template-columns: 300px 20px 300px 20px 300px;
  padding: 20px 20px 100px 20px;
`;

export const ShipmentListWrapperStyle: string = css`
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  min-height: 0;
`;

export const ShipmentListBodyStyle: string = css`
  display: grid;
  grid-template-columns: minmax(860px, 1fr);
  grid-auto-rows: min-content;
  padding: 20px 20px 100px 20px;
`;

const getHighlightColor = (
  isFocused: boolean,
  isTargeted: ?boolean,
  isCurrentFocused: ?boolean
) => {
  if (isTargeted) {
    return colors.TEAL;
  }
  if (isCurrentFocused) {
    return colors.HIGHLIGHT_DARK;
  }
  if (isFocused) {
    return colors.HIGHLIGHT;
  }
  return colors.GRAY_VERY_LIGHT;
};

export const TotalCardWrapperStyle = css`
  margin-left: 1em;
`;

export const CardWrapperStyle = css`
  display: grid;
  grid-template-columns: auto 90px;
  padding: 0 25px 0 5px;
`;

export const CardTitleStyle = css`
  ${fontSizes.SMALL};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 2px;
  word-break: break-all;
`;

export const CardVisualizeStyle = css`
  width: 90px;
  height: 30px;
`;

export const ResetBaseCardStyle = css`
  box-shadow: none;
  width: auto;
  &:hover {
    box-shadow: none;
  }
`;

export const IsNewItemStyle = css`
  position: absolute;
  top: -10px;
  left: -10px;
`;

export const ItemWrapperStyle = (
  isFocused: boolean,
  isTargeted: ?boolean,
  isCurrentFocused: ?boolean
) => {
  const focused = getHighlightColor(isFocused, isTargeted, isCurrentFocused);
  return css`
    border-radius: 10px;
    border: 5px solid ${focused};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: min-content;
    height: fit-content;
    margin: 0 0 15px 0;
    position: relative;
  `;
};

export const ShipmentCardStyle = css`
  width: 100%;
  height: 160px;
  grid-row: span 3;
  margin: 0 0 15px 0;
  min-width: 370px;
`;

export const ShipmentCardTotalStyle = css`
  margin: 0 0 15px 0;
`;
