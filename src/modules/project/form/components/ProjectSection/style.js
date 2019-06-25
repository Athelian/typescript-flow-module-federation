// @flow
import { css } from 'react-emotion';
import { layout, presets, colors } from 'styles/common';

export const ProjectSectionWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  align-items: top;
  width: 100%;
  grid-gap: 5px;
  grid-template-columns: auto 160px 105px;
`;

export const MainFieldsWrapperStyle: string = css`
  ${layout.LAYOUT};
  ${presets.BOX};
  justify-content: space-between;
`;

export const BoxWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  ${presets.BOX};
`;

export const WarningColorStyle = (diffDay: number) => css`
  color: ${diffDay < 0 ? colors.RED : colors.GRAY_DARK};
`;
