// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, scrollbars } from 'styles/common';

export const ItemsSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const ItemsSectionBodyStyle: string = css`
  display: flex;
  flex-direction: column;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 80vh;
  min-height: 282px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;
