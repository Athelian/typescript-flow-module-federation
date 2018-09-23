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

export const CardWrapperStyle = css`
<<<<<<< HEAD
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  -webkit-justify-content: space-around;
  justify-content: space-around;
=======
  padding-left: 5px;
  padding-right: 25px;
  width: 100%;
  display: flex;
  flex-direction: row;
  -webkit-justify-content: space-between;
  justify-content: space-between;
>>>>>>> 3d677b7e66f8ae3fc6b88aa778bd2f1c282e2627
`;
export const CardTitleStyle = css`
  ${fontSizes.SMALL};
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
    min-width: 190px;
    height: 50px;
    margin-bottom: 20px;
    ${fontSizes.MAIN};
    font-weight: bold;
    color: ${colors.BLACK};
  `;
};

export const ShipmentCardStyle = css`
  height: 150px;
  grid-row: span 3;
`;
