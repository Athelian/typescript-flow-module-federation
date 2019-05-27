// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, scrollbars, layout } from 'styles/common';

export const SectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const SectionBodyStyle = (totalCount: number): string => css`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: ${totalCount > 0 ? 'flex-start' : 'center'};
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const SelectRelatedTypeWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  align-items: center;
`;
