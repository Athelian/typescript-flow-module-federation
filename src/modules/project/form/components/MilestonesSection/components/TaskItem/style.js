// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

const grid = 10;

const getBorderColor = (isDragging: boolean) => (isDragging ? colors.BLUE : 'transparent');

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
  if (isDragging) {
    return colors.BLUE;
  }

  if (isGroupedOver) {
    return colors.TEAL;
  }

  return colors.WHITE;
};

export const ContainerStyle = (isDragging: boolean, isGroupedOver: boolean) => css`
  border: 2px solid transparent;
  border-color: ${getBorderColor(isDragging)};
  background-color: ${getBackgroundColor(isDragging, isGroupedOver)};
  box-shadow: ${isDragging ? `2px 2px 1px ${colors.GRAY}` : 'none'};
  padding: ${grid}px;
  min-height: 40px;
  margin-bottom: ${grid}px;
  user-select: none;

  &:hover,
  &:active {
    background-color: ${colors.TEAL};
  }

  &:focus {
    outline: none;
    border-color: ${colors.TEAL_DARK};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

export default ContainerStyle;
