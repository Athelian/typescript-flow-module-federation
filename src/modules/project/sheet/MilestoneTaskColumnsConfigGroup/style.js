// @flow
import { css } from 'react-emotion';
import { colors, layout } from 'styles/common';

export const WrapperStyle: string = css`
  ${layout.VERTICAL};
`;

export const GroupWrapperStyle: string = css`
  ${layout.HORIZONTAL};
`;

export const IconWrapperStyle: string = css`
  ${layout.VERTICAL};
  width: 150px;
`;

export const IconStyle = (color: string): string => css`
  ${layout.VERTICAL};
  ${layout.CENTER_CENTER};
  position: sticky;
  top: 0px;
  width: 100%;
  height: 150px;
  color: ${colors[color]};
  font-size: 64px;
  opacity: 0.5;
`;

export const ColumnsWrapperStyle: string = css`
  padding: 40px 0;
  margin: 0 150px 0 0;
  width: 300px;
  border-bottom: 1px solid ${colors.GRAY_SUPER_LIGHT};
`;

export const InputWrapperStyle: string = css`
  ${layout.VERTICAL};
  margin-top: 20px;
`;
