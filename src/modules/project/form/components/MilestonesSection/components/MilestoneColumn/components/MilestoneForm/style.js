// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const WrapperStyle = (isDragging: boolean) => css`
  display: flex;
  transition: background-color 0.2s ease;
  ${isDragging && `background: ${colors.WHITE}`};
`;

export default WrapperStyle;
