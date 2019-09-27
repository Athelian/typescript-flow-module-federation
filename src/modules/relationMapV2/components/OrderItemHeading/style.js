// @flow
import { css } from 'react-emotion';
import { fontSizes } from 'styles/common';

export const RightWrapperStyle: string = css`
  position: relative;
  display: grid;
  grid-template-rows: 20px 20px;
  padding: 10px 25px 5px 0;
  width: 175px;
`;

export const QuantityIconsWrapperStyle: string = css`
  display: flex;
  justify-content: space-between;
  ${fontSizes.SMALL};
  color: rgba(0, 0, 0, 0.1);
  padding: 0 0 10px 0;
  align-items: center;
`;

export const QuantityLabelStyle: string = css`
  position: absolute;
  right: calc(100% + 5px);
  bottom: 9px;
`;
