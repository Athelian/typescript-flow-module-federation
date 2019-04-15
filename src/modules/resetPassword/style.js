// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizesWithHeights, layout, shadows } from 'styles/common';

export const ContainerStyle: string = css`
  ${layout.FIT};
  ${layout.VERTICAL};
  ${layout.CENTER};
  overflow: hidden;
`;

export const FormWrapperStyle: string = css`
  ${layout.VERTICAL};
  ${layout.CENTER};
  ${layout.JUSTIFIED_CENTER};
  position: relative;
  flex: 1;
`;

export const BoxStyle: string = css`
  ${shadows.WATERFALL};
  ${borderRadiuses.MAIN};
  background-color: #fff;
  padding: 20px;
  flex-shrink: 0;
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 40px;
  justify-items: center;
`;

export const ButtonsStyle: string = css`
  ${layout.VERTICAL};
  align-items: center;
`;

export const LinkStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.TEAL};
  margin-top: 20px;
`;

export const CopyrightStyle: string = css`
  ${layout.VERTICAL};
  justify-content: flex-end;
  padding: 20px 0;
  min-height: 60px;
  color: #fff;
`;
