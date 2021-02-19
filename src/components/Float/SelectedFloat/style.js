// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, fontSizes, presets } from 'styles/common';

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

export const TotalEntitiesStyle: string = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 200px;
  z-index: 1;
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
