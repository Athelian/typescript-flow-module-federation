// @flow
import { css } from 'react-emotion';
import { presets, fontSizes, borderRadiuses, colors, scrollbars } from 'styles/common';

export const SectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const SectionBodyStyle: string = css`
  position: relative;
  display: flex;
  flex-direction: column;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 615px;
  min-height: 225px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const EmptyMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 100px 0;
`;
