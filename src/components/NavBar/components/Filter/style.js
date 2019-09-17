// @flow
import { css } from 'react-emotion';
import type { Offset } from 'hooks/useFixedCompanion';
import {
  layout,
  borderRadiuses,
  colors,
  fontSizes,
  presets,
  transitions,
  shadows,
  scrollbars,
} from 'styles/common';

export const ButtonStyle: string = css`
  ${presets.BUTTON};
  ${transitions.MAIN};
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  position: relative;
  width: 30px;
  height: 30px;
  outline: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const ActiveStyle: string = css`
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.RED};
  position: absolute;
  width: 10px;
  height: 10px;
  top: 2px;
  right: 3px;
`;

export const WrapperStyle = (offset: Offset, open: boolean) => css`
  ${layout.VERTICAL};
  ${borderRadiuses.MAIN};
  ${shadows.DROPDOWN};
  display: ${open ? 'flex' : 'none'};
  position: fixed;
  top: ${offset.top}px;
  left: ${offset.left}px;
  width: 720px;
  margin-top: 10px;
  overflow: hidden;
`;

export const ActionsStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${shadows.HEADER};
  background-color: ${colors.WHITE};
  z-index: 1;
  height: 50px;
  padding: 0 20px;
`;

export const ResetActionStyle = css`
  margin-left: auto;
  margin-right: 20px;
`;

export const FiltersListStyle = css`
  ${layout.GRID_VERTICAL};
  ${scrollbars.MAIN};
  padding: 30px 20px 0px 20px;
  grid-gap: 20px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  overflow: auto;
  max-height: 80vh;

  & > *:last-child {
    margin-bottom: 40px;
  }
`;

export const FilterWrapperStyle = css`
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  position: relative;
  padding: 0 30px 10px 30px;
`;

export const InputsWrapperStyle = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 200px;
  grid-gap: 10px;

  & > div {
    ${layout.VERTICAL};
  }
`;

export const DeleteButtonStyle = css`
  ${presets.BUTTON};
  color: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
`;
