// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors } from 'styles/common';

export const WrapperStyle = (isDragging: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.BUTTON};
  background-color: ${isDragging ? colors.TEAL : colors.GRAY_DARK};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${colors.TEAL};
  }
`;

export default WrapperStyle;
