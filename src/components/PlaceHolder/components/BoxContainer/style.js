// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const BoxContainerWrapperStyle = (height: number): string => css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: ${height}px;
  margin: 40px 0 0 0;
`;

export const SectionTitleStyle: string = css`
  position: absolute;
  height: 40px;
  width: 920px;
  top: -40px;
  left: -40px;
`;
