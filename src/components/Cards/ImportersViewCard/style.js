// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const ImportersCardStyle: string = css`
  padding: 10px;
  width: 100%;
  height: 88px;
  box-shadow: 0 10px 30px 0 rgb(0 0 0 / 10%);
  border-radius: 5px;
  background-color: #ffffff;
  transition: all 0.2s ease-out;
  cursor: pointer;
`;
export const ImporterCardHeaderStyle: string = css`
  display: flex;
`;

export const ImporterIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: ${colors.PARTNER};
  color: ${colors.WHITE};
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  font-size: 11px;
`;
