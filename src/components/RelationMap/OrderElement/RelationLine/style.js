// @flow

import { css } from 'react-emotion';
import { colors } from 'styles/common';

const getBorderColor = (isFocus: boolean) =>
  isFocus ? 'rgba(17,209,166, 0.2)' : colors.GRAY_QUITE_LIGHT;

const getRelatedBorderColor = (isFocus: boolean, hasRelation: boolean) =>
  hasRelation ? getBorderColor(isFocus) : colors.GRAY_QUITE_LIGHT;

export const RelationLine0Style = (isFocus: boolean) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% + 5px);
    border-top: 2px solid ${getBorderColor(isFocus)};
  }
`;

export const RelationLine1Style = (isFocus: boolean, hasRelation: boolean) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    right: calc(50% - 3px);
    top: calc(50% + 3px);
    border-top: 2px solid ${getBorderColor(isFocus)};
  }
  &:after {
    content: '';
    position: absolute;
    left: calc(50% + 3px);
    right: 0;
    top: calc(50% + 3px);
    border-top: 2px solid ${getRelatedBorderColor(isFocus, hasRelation)};
  }
`;

export const RelationLine2Style = (isFocus: boolean) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -20px;
    top: -40px;
    border-right: 3px solid ${getBorderColor(isFocus)};
  }
`;

export const RelationLine3Style = (isFocus: boolean, hasRelation: boolean) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: -40px;
    bottom: calc(50% - 5px);
    border-left: 2px solid ${getBorderColor(isFocus)};
    border-bottom: 2px solid ${getRelatedBorderColor(isFocus, hasRelation)};
    width: 50%;
  }
`;

export const RelationLine4Style = (isFocus: boolean, hasRelation: boolean) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: -40px;
    bottom: calc(50% - 5px);
    border-right: 3px solid ${getBorderColor(isFocus)};
  }

  &:after {
    content: '';
    position: absolute;
    left: calc(50% + 2px);
    right: 0;
    top: calc(50% + 3px);
    border-top: 2px solid ${getRelatedBorderColor(isFocus, hasRelation)};
  }
`;
