// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, layout, shadows, presets } from 'styles/common';

export const RadioInputFilterFormWrapperStyle = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr min-content;
  grid-gap: 15px;
  align-items: center;
  width: 100%;
`;

export const RadioInputLabelStyle = (selected: boolean, disabled: boolean): string => css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content 1fr;
  grid-gap: 15px;
  align-items: center;
  width: 100%;

  color: ${colors.GRAY_DARK_1};
  ${disabled &&
    `
    color: ${colors.GRAY_LIGHT};
  `};
  ${!disabled &&
    `
    cursor: pointer;
    
    &:hover {
      & > button {
        background-color: ${selected ? colors.TEAL_DARK : colors.GRAY_SUPER_LIGHT};
      }
    }
  `};
`;

export const RadioButtonStyle = (selected: boolean, disabled: boolean): string => css`
  ${!disabled && presets.BUTTON};
  ${!disabled && shadows.INPUT};

  width: 20px;
  height: 20px;
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
  border: 2px solid ${colors.WHITE};
  background-color: ${selected ? colors.TEAL : colors.WHITE};
`;

export const RadioInputActionsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 15px;
`;
