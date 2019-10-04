// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, fontSizes, presets, shadows, transitions } from 'styles/common';

export const SelectedEntitiesWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 25px;
  left: calc(50% - 105px);
  border-radius: 25px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 5px 5px 5px;
  user-select: none;
`;

export const EntitiesWrapperStyle: string = css`
  display: grid;
  grid-template-columns: repeat(5, 30px);
  grid-gap: 5px;
  justify-content: center;
`;

export const EntityWrapperStyle = (count: number): string => css`
  position: relative;
  display: flex;
  height: 20px;
  ${count > 0
    ? `
    color: ${colors.TEAL};
    &:hover {
      & > div {
        opacity: 0;
      }
      & > button {
        opacity: 1;
      }
    }
  `
    : `
    color: ${colors.GRAY_DARK};
  `};
`;

export const EntityIconStyle: string = css`
  font-size: 11px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  ${transitions.MAIN};
`;

export const EntityCountStyle: string = css`
  ${fontSizes.SMALL};
  height: 20px;
  line-height: 20px;
  ${transitions.MAIN};
`;

export const ClearEntityButtonStyle: string = css`
  position: absolute;
  left: 0;
  top: 3px;
  ${presets.BUTTON};
  height: 14px;
  width: 100%;
  color: ${colors.RED};
  font-size: 11px;
  opacity: 0;
  background-color: ${colors.WHITE};
  ${borderRadiuses.BUTTON};
  ${shadows.INPUT};
`;

export const TotalEntitiesStyle: string = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 200px;
  border: 4px solid ${colors.TEAL_HALF};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.WHITE};
`;

export const ClearTotalButtonStyle: string = css`
  position: absolute;
  right: 0;
  ${presets.BUTTON};
  width: 40px;
  height: 40px;
  color: ${colors.GRAY_VERY_LIGHT};
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;
