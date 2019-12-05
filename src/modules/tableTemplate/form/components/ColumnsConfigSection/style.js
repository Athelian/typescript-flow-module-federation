// @flow
import { css } from 'react-emotion';
import { presets, colors, layout, borderRadiuses, scrollbars } from 'styles/common';

export const ColumnsConfigSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const ColumnsConfigSectionBodyStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 30px;
  padding: 30px 10px;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;
