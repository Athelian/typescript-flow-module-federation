// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const ShipmentCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  width: 880px;
  height: 200px;
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;

export default ShipmentCardWrapperStyle;
