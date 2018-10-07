// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const ShipmentLabelStyle = css`
  height: 24px;
  line-height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 30px;
  padding-left: 5px;
  ${presets.BOX};
  box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

export default ShipmentLabelStyle;
