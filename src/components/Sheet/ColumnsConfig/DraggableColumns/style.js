// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, borderRadiuses } from 'styles/common';

export const InnerColumnsWrapperStyle: string = css`
  display: grid;
  grid-auto-rows: 30px;
  grid-template-columns: 1fr;
  grid-gap: 10px;
`;

export const InnerColumnStyle: string = css`
  position: relative;
  display: grid;
  grid-template-columns: 25px 1fr min-content;
  align-items: center;
  width: 271px;
`;

export const NewLabelStyle: string = css`
  height: 18px;
  ${fontSizes.SMALL};
  line-height: 18px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${colors.WHITE};
  background: ${colors.TEAL_HALF};
  ${borderRadiuses.MAIN};
  padding: 0 5px;
  margin: 6px 5px;
`;
