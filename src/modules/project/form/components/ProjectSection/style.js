// @flow
import { css } from 'react-emotion';
import { layout, presets, colors } from 'styles/common';

export const ProjectSectionWrapperStyle = (isExpand: boolean) => css`
  ${layout.GRID_VERTICAL};
  ${isExpand &&
    `
    height: 22px;
    overflow: hidden;
  `}
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

export const ExpandWrapperStyle = css`
  ${presets.BOX};
  text-align: center;
  background: ${colors.GRAY_DARK};
  color: #fff;
  cursor: pointer;
`;
