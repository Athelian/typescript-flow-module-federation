/* stylelint-disable no-duplicate-selectors */
// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

const getborderbackground = (isFocus: boolean, focusMode: string) => {
  if (!isFocus) {
    return colors.GRAY_QUITE_LIGHT;
  }
  if (focusMode === 'TARGET_TREE') {
    return colors.TEAL;
  }
  if (focusMode === 'HIGHLIGHT') {
    return 'rgba(251,170,29, 0.5)';
  }
  return colors.GRAY_QUITE_LIGHT;
};

const getrelatedbackground = (isFocus: boolean, focusMode: string, hasRelation: boolean) =>
  hasRelation ? getborderbackground(isFocus, focusMode) : colors.GRAY_QUITE_LIGHT;

export const RelationLine0Style = (isFocus: boolean, focusMode: string) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% + 5px);
    border-top: 2px solid ${getborderbackground(isFocus, focusMode)};
  }
`;

export const RelationLine1Style = (
  isFocus: boolean,
  focusMode: string,
  hasRelation: boolean
) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: calc(50% - 3px);
    top: calc(50% + 3px);
    border-top: 2px solid ${getborderbackground(isFocus, focusMode)};
  }

  &::after {
    content: '';
    position: absolute;
    left: calc(50% + 3px);
    right: 0;
    top: calc(50% + 3px);
    border-top: 2px solid ${getrelatedbackground(isFocus, focusMode, hasRelation)};
  }
`;

export const RelationLine2Style = (isFocus: boolean, focusMode: string) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -20px;
    top: -40px;
    border-right: 3px solid ${getborderbackground(isFocus, focusMode)};
  }
`;

export const RelationLine3Style = (isFocus: boolean, focusMode: string) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: -40px;
    bottom: calc(50% - 5px);
    border-left: 2px solid ${getborderbackground(isFocus, focusMode)};
    border-bottom: 2px solid ${getborderbackground(isFocus, focusMode)};
    width: 50%;
  }
`;

export const RelationLine4Style = (
  isFocus: boolean,
  focusMode: string,
  hasRelation: boolean
) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: -40px;
    bottom: calc(50% - 5px);
    border-right: 3px solid ${getborderbackground(isFocus, focusMode)};
  }

  &::after {
    content: '';
    position: absolute;
    left: calc(50% + 2px);
    right: 0;
    top: calc(50% + 3px);
    border-top: 2px solid ${getrelatedbackground(isFocus, focusMode, hasRelation)};
  }
`;
