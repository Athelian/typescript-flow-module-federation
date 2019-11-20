// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const SelectInputStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  width: 30px;
  height: 30px;
  padding: 0 5px;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
`;
