// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes } from 'styles/common';

export const AdjustmentWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  &:hover {
    & > div {
      & > button,
      div {
        opacity: 1;
      }
    }
  }
`;

export const AdjustmentFieldsWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const DragBarStyle = css`
  position: absolute;
  width: 30px;
  height: 30px;
  left: -30px;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: 0;
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const RemoveButtonStyle: string = css`
  position: absolute;
  width: 30px;
  height: 30px;
  right: -30px;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: 0;
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;
