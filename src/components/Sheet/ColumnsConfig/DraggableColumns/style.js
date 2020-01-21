// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const InnerColumnsWrapperStyle: string = css`
  display: grid;
  grid-auto-rows: 30px;
  grid-template-columns: 1fr;
  grid-gap: 10px;
`;

export const InnerColumnStyle: string = css`
  display: grid;
  grid-template-columns: 25px 1fr 30px;
  align-items: center;
  width: 271px;
`;

export const NewLabelStyle: string = css`
  height: 18px;
  margin: 6px 0;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${colors.WHITE};
  background: rgba(17, 209, 166, 0.5);
  border-radius: 5px;
`;
