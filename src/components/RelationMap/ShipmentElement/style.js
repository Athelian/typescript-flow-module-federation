// @flow
import { css } from 'react-emotion';

export const ShipmentCardWrapperStyle = css`
  display: flex;
  flex-direction: column;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;

  > div:nth-child(2) {
    padding-left: 17px;
    padding-right: 25px;
  }
`;

export const ShipmentBlankContent = css`
  height: 1em;
`;

export default ShipmentCardWrapperStyle;
