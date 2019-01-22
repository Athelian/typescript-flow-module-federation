// @flow
import { css } from 'react-emotion';
import { colors, scrollbars, shadows, borderRadiuses } from 'styles/common';

export const ContainersWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  display: grid;
  grid-template-columns: 235px;
  grid-template-rows: 50px 1fr 50px;
  ${shadows.HEADER_RIGHT};
  z-index: 2;
`;

export const ContainersNavbarWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  position: relative;
`;

export const ContainersBodyWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  grid-gap: 30px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  height: 100%;
  max-height: 65vh;
  ${shadows.HEADER_RIGHT};
  padding: 30px 10px 30px 20px;
`;

export const ContainersFooterWrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER_REVERSE};
`;
