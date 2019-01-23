// @flow
import { css } from 'react-emotion';

export const HorizontalPortsWrapperStyle: string = css`
  display: flex;
  width: 100%;
`;

export const PortNameWrapperStyle: string = css`
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
`;

export const BlankSpaceStyle: string = css`
  flex: 1;
`;

export const FlexSizeStyle = (flex: number) => css`
  flex: ${flex};
`;
