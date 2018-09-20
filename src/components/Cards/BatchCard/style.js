// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const BatchCardWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 195px;
  height: 195px;
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;

export default BatchCardWrapperStyle;
