// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

export const RightWrapperStyle: string = css`
  position: relative;
  display: grid;
  grid-template-columns: 75px 135px;
  padding: 5px 20px 5px 0;
`;

export const DatesWrapperStyle: string = css`
  position: relative;
  display: grid;
  grid-template-rows: 20px 20px;
  grid-gap: 5px;
`;

export const DashStyle: string = css`
  position: absolute;
  top: calc(50% - 11px);
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  height: 20px;
  line-height: 20px;
`;
