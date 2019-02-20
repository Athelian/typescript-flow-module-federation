// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, layout, shadows, presets } from 'styles/common';

export const RadioButtonWrapperStyle = (selected: boolean): string => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 15px;
  align-items: center;
  width: 100%;
  cursor: pointer;
  &:hover {
    & > button {
      background-color: ${selected ? colors.TEAL_DARK : colors.GRAY_SUPER_LIGHT};
    }
  }
`;

export const RadioButtonStyle = (selected: boolean): string => css`
  ${presets.BUTTON};
  ${shadows.INPUT};
  width: 20px;
  height: 20px;
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
  border: 2px solid ${colors.WHITE};
  background-color: ${selected ? colors.TEAL : colors.WHITE};
`;
