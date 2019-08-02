// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

const borderBackground = (isFocused: boolean, isTargeted: boolean) => {
  if (isTargeted) {
    return colors.TEAL;
  }
  if (isFocused) {
    return colors.HIGHLIGHT;
  }
  return colors.GRAY_QUITE_LIGHT;
};

const relatedBackground = (isFocus: boolean, isTargeted: boolean, hasRelation: boolean) =>
  hasRelation ? borderBackground(isFocus, isTargeted) : colors.GRAY_QUITE_LIGHT;

export const RelationLine0Style = (isFocus: boolean, isTargeted: boolean) => css`
  position: relative;
  width: calc(100%);
  min-width: 10px;
  height: 40px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% + 5px);
    border-top: 2px solid ${borderBackground(isFocus, isTargeted)};
  }
`;

export const RelationLine1Style = (
  isFocus: boolean,
  isTargeted: boolean,
  hasRelation: boolean
) => css`
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
    border-top: 2px solid ${borderBackground(isFocus, isTargeted)};
  }

  &::after {
    content: '';
    position: absolute;
    left: calc(50% + 3px);
    right: 0;
    top: calc(50% + 3px);
    border-top: 2px solid ${relatedBackground(isFocus, isTargeted, hasRelation)};
  }
`;

export const RelationLine2Style = (isFocus: boolean, isTargeted: boolean) => css`
  position: relative;
  width: calc(100%);
  min-width: 10px;
  height: 40px;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 15px;
    top: -40px;
    border-right: 3px solid ${borderBackground(isFocus, isTargeted)};
  }
`;

export const RelationLine3Style = (isFocus: boolean, isTargeted: boolean) => css`
  position: relative;
  width: calc(100%);
  min-width: 10px;
  height: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: -40px;
    bottom: calc(50% - 5px);
    border-left: 2px solid ${borderBackground(isFocus, isTargeted)};
    border-bottom: 2px solid ${borderBackground(isFocus, isTargeted)};
    width: 50%;
  }
`;

export const RelationLine4Style = (
  isFocus: boolean,
  isTargeted: boolean,
  hasRelation: boolean
) => css`
  position: relative;
  width: calc(100%);
  min-width: 10px;
  height: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: -40px;
    bottom: calc(50% - 5px);
    border-right: 3px solid ${borderBackground(isFocus, isTargeted)};
  }

  &::after {
    content: '';
    position: absolute;
    left: calc(50% + 2px);
    right: 0;
    top: calc(50% + 3px);
    border-top: 2px solid ${relatedBackground(isFocus, isTargeted, hasRelation)};
  }
`;
