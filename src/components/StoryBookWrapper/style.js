// @flow
import { css } from 'react-emotion';
import { layout, presets, colors } from 'styles/common';

export const StoryBookWrapperStyle: string = css`
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 50px;
`;

export const StoryBookWrapperContentStyle = (direction: 'vertical' | 'horizontal'): string => css`
  padding: 50px;
  ${direction === 'vertical' ? layout.GRID_VERTICAL : layout.GRID_HORIZONTAL};
  grid-gap: 20px;
  ${presets.BOX};
`;
