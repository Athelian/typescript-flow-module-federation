// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const ShipmentWarehouseCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;

export default ShipmentWarehouseCardWrapperStyle;
