// @flow
import { css } from 'react-emotion';

export const HorizontalPortsWrapperStyle: string = css`
  display: flex;
  width: 100%;
`;

export const PortNameWrapperStyle: string = css`
  display: flex;
  flex: 1;
  justify-content: center;
`;

export const BlankSpaceStyle = (flex: number): string => css`
  flex: ${flex};
`;
