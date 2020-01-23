// @flow
import { css } from 'react-emotion';

export const WrapperStyle = (fixWidth: boolean) => css`
  ${fixWidth &&
    `
    min-width: 130px;
    max-width: 130px;
  `};
`;

export default WrapperStyle;
