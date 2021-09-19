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

export const BadgeContainer = css`
  position: absolute;
  width: 67px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: -13px;
  right: 40px;
  z-index: 1;
`;

export const BadgeStyle = css`
  width: 20px;
  height: 20px;
  background-color: ${colors.RED};
  ${borderRadiuses.CIRCLE};
  border: 2px solid ${colors.GRAY_SUPER_LIGHT};
  position: relative;
  span {
    color: #fff;
    font-size: 12px;
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const CommentStyle = css`
  color: #0B6EDE;
  font-size: 20px;
  margin-right: -2px;
  position: relative;
  span {
    color: #fff;
    font-size: 12px;
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  svg path {
    stroke: ${colors.GRAY_SUPER_LIGHT};
    stroke-width: 50px;
    }
  }
`;

export const CustomDocumentIcon = css`
  height: 19px;
  width: 17px;
  border-radius: 2px;
  background-color: #eeeeee;
  clip-path: polygon(0% 0%, 12px 0%, 100% 5px, 100% 100%, 0% 100%);
  position: relative;
  span {
    color: #fff;
    font-size: 12px;
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &:before {
    content: '';
    display: block;
    position: relative;
    top: 2px;
    left: 2px;
    height: 15px;
    width: 13px;
    background-color: #a34fff;
    border-radius: 1px;
    clip-path: polygon(0% 0%, 10px 0%, 100% 3px, 100% 100%, 0% 100%);
  }
`;
