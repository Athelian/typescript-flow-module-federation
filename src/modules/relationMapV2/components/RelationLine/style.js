// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

const borderBackground = (isTargeted: boolean) => {
  if (isTargeted) {
    return colors.TEAL;
  }
  return colors.GRAY_VERY_LIGHT;
};

const relatedBackground = (isTargeted: boolean, hasRelation: boolean) =>
  hasRelation ? borderBackground(isTargeted) : colors.GRAY_VERY_LIGHT;

export const RelationLineHorizontalStyle = (isTargeted: boolean, hasRelation: boolean) => css`
  position: relative;
  width: calc(100%);
  min-width: 10px;
  height: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: calc(50% - 3px);
    top: calc(50% + 3px);
    border-top: 2px solid ${borderBackground(isTargeted)};
  }

  &::after {
    content: '';
    position: absolute;
    left: calc(50% + 3px);
    right: 0;
    top: calc(50% + 3px);
    border-top: 2px solid ${relatedBackground(isTargeted, hasRelation)};
  }
`;

export const RelationLineVerticalStyle = (isTargeted: boolean) => css`
  position: relative;
  width: calc(100%);
  min-width: 10px;
  height: 40px;
  margin-left: 2px;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 15px;
    top: -50px;
    border-right: 3px solid ${borderBackground(isTargeted)};
  }
`;
