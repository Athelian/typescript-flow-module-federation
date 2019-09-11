// @flow
import { css } from 'react-emotion';
import { layout, colors, shadows, scrollbars } from 'styles/common';

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

export const ColumnFillerStyle = (color: string) => css`
  min-width: 20px;
  border-top: 4px solid ${color};
  flex: 1;
`;

export const ContentStyle = css`
  width: 100%;
  height: 100%;
  background: ${colors.WHITE};
  z-index: 1;
`;

export const GridStyle = css`
  ${scrollbars.MAIN};
`;
