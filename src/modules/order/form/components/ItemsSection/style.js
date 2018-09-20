// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, scrollbars } from 'styles/common';

export const ItemsSectionWrapperStyle = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  padding: 50px 0 0 0;
  height: min-content;
`;

export const ItemsSectionBodyStyle = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;
