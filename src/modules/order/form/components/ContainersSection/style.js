// @flow
import { css } from 'react-emotion';
import { presets, fontSizes, colors, borderRadiuses, scrollbars } from 'styles/common';

export const ContainersSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const ContainersSectionBodyStyle: string = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, 195px);
  grid-auto-rows: min-content;
  grid-row-gap: 30px;
  grid-column-gap: 20px;
  padding: 30px 20px;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: overlay;
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
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;
