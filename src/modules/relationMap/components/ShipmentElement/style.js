// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const ShipmentElementWrapperStyle = css`
  display: flex;
  flex-direction: column;

  > div:first-child {
    height: 24px;
    line-height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 30px;
    padding-left: 5px;
    ${presets.BOX};
    box-shadow: 0 10px 15px 0 rgba(0, 0, 0, 0.1);
  }

  > div:nth-child(2) {
    padding: 0 30px;
  }
`;

export default ShipmentElementWrapperStyle;
