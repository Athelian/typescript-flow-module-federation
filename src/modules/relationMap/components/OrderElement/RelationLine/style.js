// @flow

import { css } from 'react-emotion';
import { colors } from 'styles/common';

const getBorderColor = (isFocus: boolean) =>
  isFocus ? colors.TEAL_QUITE_LIGHT : colors.GRAY_QUITE_LIGHT;

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

export const RelationLine1Style = (isFocus: boolean) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &:before {
    content: '';
    position: absolute;
    left: 5px;
    right: 0;
    top: calc(50% + 5px);
    border-top: 2px solid ${getBorderColor(isFocus)};
  }

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    top: calc(50% + 5px);
    bottom: -20px;
    border-right: 2px solid ${getBorderColor(isFocus)};
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
    top: -20px;
    border-right: 2px solid ${getBorderColor(isFocus)};
  }
`;

export const RelationLine3Style = (isFocus: boolean) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: -20px;
    bottom: -20px;
    border-right: 2px solid ${getBorderColor(isFocus)};
  }

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    right: 0;
    top: calc(50% + 5px);
    border-top: 2px solid ${getBorderColor(isFocus)};
  }
`;

export const RelationLine4Style = (isFocus: boolean) => css`
  position: relative;
  width: calc(100%);
  height: 40px;

  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: -10px;
    bottom: calc(50% - 5px);
    border-right: 2px solid ${getBorderColor(isFocus)};
  }

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    right: 0;
    top: calc(50% + 5px);
    border-top: 2px solid ${getBorderColor(isFocus)};
  }
`;
