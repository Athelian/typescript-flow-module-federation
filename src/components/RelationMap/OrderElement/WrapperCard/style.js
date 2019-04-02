// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';

export const WrapperCardStyle = (fit: boolean): string => css`
  width: ${fit ? 'auto' : '100%'};
  height: fit-content;
  position: relative;
  cursor: pointer;
  ${borderRadiuses.MAIN};
`;

export default WrapperCardStyle;
