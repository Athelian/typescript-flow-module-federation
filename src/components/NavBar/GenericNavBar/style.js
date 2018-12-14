// @flow
import { css } from 'react-emotion';
import { colors, shadows, transitions } from 'styles/common';

export const GenericNavBarStyle: string = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  flex-shrink: 0;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  ${transitions.EXPAND};
`;

export default GenericNavBarStyle;
