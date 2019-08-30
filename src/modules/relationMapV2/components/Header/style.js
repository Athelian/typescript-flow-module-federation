// @flow
import { css } from 'react-emotion';

export const HeadingStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 2;
  height: 50px;
`;

export const RowStyle = css`
  display: grid;
  grid-template-columns: repeat(5, min-content);
`;

export const ButtonStyle = css`
  font-size: 12px;
  line-height: 15px;
  display: flex;
  align-items: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ffffff;
  &:hover {
    cursor: pointer;
  }
`;
