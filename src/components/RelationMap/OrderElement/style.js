// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

const getBorderColor = (isFocused: boolean) => (isFocused ? colors.TEAL : colors.GRAY_QUITE_LIGHT);

export const OrderListItemWrapperStyle = (isFocused: boolean) => css`
  box-shadow: none !important;
  border: 5px solid ${getBorderColor(isFocused)};
`;

export const OrderListItemStyle = (isFocused: boolean) => css`
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  -webkit-box-shadow: ${getBorderColor(isFocused)} 0 0 0 5px;
  -moz-box-shadow: ${getBorderColor(isFocused)} 0 0 0 5px;
  box-shadow: ${getBorderColor(isFocused)} 0 0 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 190px;
  height: 40px;
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;

export const TotalCardWrapperStyle = css`
  margin: auto 10px;

  display: flex;
  justify-content: space-between;

  > span:nth-child(1) {
    color: #555555;
  }

  > span:nth-child(2) {
    color: #aaaaaa;
    font-weight: 500;
  }
`;

export const CardWrapperStyle = css`
  display: flex;
  //grid-template-columns: 1fr 1fr;
  padding: 0 25px 0 10px;
`;
export const CardTitleStyle = css`
  ${fontSizes.SMALL};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 2px;
  word-break: break-all;
  flex: 1;
`;
export const CardVisualizeStyle = css`
  width: 100%;
  position: relative;
  height: 30px;
  flex: 1;
`;
export const BatchCardVisualizeStyle = css`
  width: 100%;
  position: relative;
  height: 30px;
  flex: 0.5;
`;

export const ResetBaseCardStyle = css`
  box-shadow: none;
  width: auto;
  &:hover {
    box-shadow: none;
  }
`;

export const ItemWrapperStyle = (isFocused: boolean) => {
  const focused = getBorderColor(isFocused);
  return css`
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    border: 5px solid ${focused};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: auto;
    height: fit-content;
    min-height: 50px;
    max-height: 200px;
    margin-bottom: 15px;
    ${fontSizes.MAIN};
    font-weight: bold;
    color: ${colors.BLACK};
  `;
};

export const ShipmentCardStyle = css`
  height: 160px;
  grid-row: span 3;
  margin-bottom: 35px;
  min-width: 370px;
`;

export const ShipmentCardTotalStyle = css`
  margin-bottom: 35px;
`;
