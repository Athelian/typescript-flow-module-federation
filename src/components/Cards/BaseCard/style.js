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

export const SelectableCardStyle = (selected: boolean): string => css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 4px solid ${selected ? colors.TEAL : colors.TRANSPARENT};
  ${borderRadiuses.MAIN};
  opacity: 0.5;
`;

export const BadgeStyle = css`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  background-color: ${colors.RED};
  ${borderRadiuses.CIRCLE};
  z-index: 1;
`;
