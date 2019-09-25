// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses, colors, presets, transitions, shadows } from 'styles/common';

export const ButtonStyle: string = css`
  ${presets.BUTTON};
  ${transitions.MAIN};
  font-size: 18px;
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  position: relative;
  width: 30px;
  height: 30px;
  &:hover {
    color: ${colors.GRAY_DARK};
  }
`;

export const ActiveStyle: string = css`
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.RED};
  position: absolute;
  width: 10px;
  height: 10px;
  top: 0px;
  right: 0px;
`;

export const WrapperStyle: string = css`
  ${layout.VERTICAL};
  ${borderRadiuses.MAIN};
  ${shadows.DROPDOWN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  min-height: 50vh;
`;

export const ActionsStyle = css`
  position: sticky;
  top: -100px;
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${shadows.HEADER};
  background-color: ${colors.WHITE};
  height: 50px;
  padding: 0 20px;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 1;
`;

export const ResetActionStyle = css`
  margin-left: auto;
  margin-right: 20px;
`;

export const FiltersListStyle = css`
  ${layout.GRID_VERTICAL};
  padding: 30px 20px 0px 20px;
  grid-gap: 20px;
  & > *:last-child {
    margin-bottom: 40px;
  }
`;

export const FilterWrapperStyle = css`
  ${presets.BOX};
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

export const AddFilterButtonWrapperStyle = css`
  width: min-content;
`;
