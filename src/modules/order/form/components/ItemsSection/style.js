// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, scrollbars, fontSizes } from 'styles/common';

export const ItemsSectionWrapperStyle = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  padding: 50px 0 0 0;
  height: min-content;
  max-height: 80vh;
`;

export const ItemsSectionBodyStyle = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  padding: 100px;
`;
