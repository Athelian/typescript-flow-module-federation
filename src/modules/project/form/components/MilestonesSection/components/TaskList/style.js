// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

const grid = 10;
const scrollContainerHeight: number = 250;

const getBackgroundColor = (isDraggingOver: boolean, isDraggingFrom: boolean): string => {
  if (isDraggingOver) {
    return colors.BLUE;
  }
  if (isDraggingFrom) {
    return colors.TEAL;
  }
  return colors.WHITE;
};

export const WrapperStyle = ({
  isDraggingFrom,
  isDraggingOver,
  isDropDisabled,
}: {
  isDraggingOver: boolean,
  isDraggingFrom: boolean,
  isDropDisabled: boolean,
}) => css`
  background-color: ${getBackgroundColor(isDraggingOver, isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${isDropDisabled ? 0.5 : 'inherit'};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`;

export const DropZoneStyle: string = css`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;
  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

export const ScrollContainerStyle = css`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 100vh;
`;
