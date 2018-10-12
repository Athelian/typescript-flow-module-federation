// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const WrapperStyle = css`
  ${layout.VERTICAL};
  ${layout.CENTER};
`;

export const TimelineStyle = css`
  display: grid;
  grid-auto-rows: min-content;
  grid-gap: 20px;
  position: relative;
  max-width: 800px;
  width: 100%;
`;

export const FormWrapperStyle = css`
  ${layout.HORIZONTAL};
  max-width: 800px;
  width: 100%;
  margin: 20px 0 0 0;
`;
