// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const ShipmentIconStyle: string = css`
  position: absolute;
  top: 0;
  right: -40px;
  height: 30px;
  line-height: 30px;
  width: 30px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  background-color: ${colors.WHITE};
  ${fontSizes.MAIN};
`;
