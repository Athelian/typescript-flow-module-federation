// @flow
import { css } from 'react-emotion';

export const ShipmentLabelStyle = css`
  height: 24px;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 30px;
  padding-left: 5px;
  // box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  > span:nth-child(2) {
    vertical-align: bottom;
    display: flex;
  }
`;

export default ShipmentLabelStyle;
