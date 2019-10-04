// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, fontSizes, presets, shadows } from 'styles/common';

export const EntitiesWrapperStyle: string = css`
  display: grid;
  grid-template-columns: repeat(5, 30px);
  grid-gap: 5px;
  justify-content: center;
  padding: 0 0 0 10px;
  user-select: none;
`;

export const EntityWrapperStyle = (count: number): string => css`
  position: relative;
  display: flex;
  height: 20px;
  color: ${count > 0 ? colors.BLUE : colors.GRAY_DARK};
  &:hover {
    & > div {
      opacity: 0;
    }
    & > button {
      opacity: 1;
    }
  }
`;

export const EntityIconStyle: string = css`
  font-size: 11px;
  height: 20px;
  width: 20px;
  line-height: 20px;
`;

export const EntityCountStyle: string = css`
  ${fontSizes.SMALL};
  height: 20px;
  line-height: 20px;
`;

export const SelectedEntitiesWrapperStyle: string = css`
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
