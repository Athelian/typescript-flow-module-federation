// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, scrollbars, fontSizes } from 'styles/common';

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

export const ItemGridStyle = css`
  display: flex;
  flex-wrap: wrap;
`;

export const ItemStyle = css`
  display: flex;
  margin: 10px;
`;

export const BatchAreaStyle = css`
  flex: 1;
  min-width: 640px;
  min-height: min-content;
  height: 300px;
  margin-left: 20px;
  background: ${colors.GRAY_LIGHT};
  ${borderRadiuses.MAIN};
  padding: 0 10px;
  display: flex;
  flex-flow: column wrap;
`;

export const BatchAreaHeaderStyle = css`
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
`;

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  padding: 100px;
`;
