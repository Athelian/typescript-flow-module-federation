// @flow
import { css } from 'react-emotion';
import { layout, colors, shadows } from 'styles/common';

export const WrapperStyle = css`
  ${layout.VERTICAL}
  width: 100%;
  height: 100%;
`;

export const ColumnsWrapperStyle = css`
  ${layout.HORIZONTAL};
  ${shadows.HEADER};

  overflow: hidden;
  background: ${colors.WHITE};
  height: 40px;
  z-index: 2;
`;

export const ContentStyle = css`
  width: 100%;
  height: 100%;
  background: ${colors.WHITE};
  z-index: 1;
`;
