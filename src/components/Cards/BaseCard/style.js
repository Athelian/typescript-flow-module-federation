// @flow
import { css } from 'react-emotion';
import { colors, presets, transitions, borderRadiuses } from 'styles/common';

type CardProps = {
  disabled: boolean,
  readOnly: boolean,
  isArchived: boolean,
};

export const CardStyle = ({ disabled, readOnly, isArchived }: CardProps): string => css`
  width: min-content;
  height: min-content;
  ${presets.BOX};
  ${transitions.EXPAND};
  position: relative;
  cursor: pointer;
  ${isArchived && 'opacity: 0.6'};
  ${readOnly && 'cursor: default'};
  ${disabled && 'cursor: not-allowed'};
  ${!(readOnly || disabled) &&
    `
    &:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  `};
`;

export const SelectableCardStyle = (selected: boolean, flattenCornerIcon: boolean): string => css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid ${selected ? colors.TEAL : colors.TRANSPARENT};
  ${borderRadiuses.MAIN};
  opacity: 0.5;
  ${flattenCornerIcon && 'pointer-events: none'};
  cursor: pointer;
`;

export const BadgeContainer = (right: string) => css`
  position: absolute;
  width: 63px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2px;
  top: -14px;
  right: ${right};
  z-index: 1;
  max-height: 28px;
`;

export const BadgeStyle = css`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 14px;
  height: 14px;
  background-color: ${colors.RED};
  ${borderRadiuses.CIRCLE};
  border: 2px solid ${colors.GRAY_SUPER_LIGHT};
  z-index: 1;
`;

export const NewBadgeStyle = (fontSize: string) => css`
  width: 19px;
  height: 19px;
  min-width: 19px;
  min-height: 19px;
  grid-column: 3;
  margin-left: -1px;
  background-color: ${colors.RED};
  ${borderRadiuses.CIRCLE};
  border: 1.5px solid ${colors.GRAY_SUPER_LIGHT};
  position: relative;
  &:hover {
    margin-top: -2px;
  }
  span {
    color: #fff;
    font-size: ${fontSize};
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const CommentStyle = (fontSize: string) => css`
  color: #0B6EDE;
  grid-column: 1;
  font-size: 18px;
  position: relative;
  margin-top: -1px;
  max-width: 23px;
  &:hover {
    margin-top: -3px;
  }
  span {
    color: #fff;
    font-size: ${fontSize};
    position: absolute;
    top: 44%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  svg {
    max-width: 30px !important;
  }
  svg path {
    stroke: ${colors.GRAY_SUPER_LIGHT};
    stroke-width: 20px;
    }
  }
`;

export const CustomDocumentIcon = (fontSize: string) => css`
  height: 17px;
  margin-top: 1px;
  width: 16px;
  grid-column: 2;
  border-radius: 2px;
  background-color: #eeeeee;
  clip-path: polygon(0% 0%, 12px 0%, 100% 5px, 100% 100%, 0% 100%);
  position: relative;
  &:hover {
    margin-top: -1px;
  }
  span {
    color: #fff;
    font-size: ${fontSize};
    position: absolute;
    top: 47%;
    left: 49%;
    transform: translate(-50%, -50%);
  }
  &:before {
    content: '';
    display: block;
    position: relative;
    top: 1px;
    left: 1px;
    height: 15px;
    width: 14px;
    background-color: #a34fff;
    border-radius: 1px;
    clip-path: polygon(0% 0%, 10.5px 0%, 100% 4.5px, 100% 100%, 0% 100%);
  }
`;
