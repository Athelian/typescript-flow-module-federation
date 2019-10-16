// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors, presets } from 'styles/common';

export const ItemMoveButtonsWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const MoveWrapperStyle: string = css`
  display: flex;
  border-bottom: 1px solid ${colors.GRAY_SUPER_LIGHT};
  justify-content: space-between;
`;

export const TitleDescriptionWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: min-content;
  padding: 0 0 10px 0;
`;

export const DescriptionStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  padding: 5px;
  ${presets.ELLIPSIS};
`;
