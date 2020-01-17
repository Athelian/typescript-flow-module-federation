// @flow
import { css } from 'react-emotion';

export const WrapperStyle = (fixWidth: boolean) => css`
  margin: 0 5px;
  ${fixWidth && 'min-width: 100px;'};
`;

export default WrapperStyle;
