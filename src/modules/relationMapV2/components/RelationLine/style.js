// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

const borderBackground = (isTargeted: boolean): string => {
  if (isTargeted) {
    return colors.TEAL;
  }
  return colors.GRAY_LIGHT;
};

const relatedBackground = (isTargeted: boolean, hasRelation: boolean): string =>
  hasRelation ? borderBackground(isTargeted) : colors.GRAY_LIGHT;

export const RelationLineHorizontalStyle = (
  isTargeted: boolean,
  hasRelation: boolean
): string => css`
  position: relative;
  height: 100%;

  &::after {
    content: '';
    position: absolute;
    height: 4px;
    width: 100%;
    left: 0;
    top: calc(50% - 2px);
    background-color: ${relatedBackground(isTargeted, hasRelation)};
  }
`;

export const RelationLineVerticalStyle = (isTargeted: boolean): string => css`
  position: relative;
  height: 100%;

  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: calc(100% + ${isTargeted ? '24px' : '20px'});
    top: calc(-100% + ${isTargeted ? '6px' : '10px'});
    right: -2px;
    background-color: ${borderBackground(isTargeted)};
  }
`;
