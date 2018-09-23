// @flow
import { css } from 'react-emotion';
import { borderRadiuses, presets } from 'styles/common';

export const ShipmentElementWrapperStyle = css`
  //width: 350px;
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
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
