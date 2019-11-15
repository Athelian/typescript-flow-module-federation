// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const CurrentQuantityWrapperStyle: string = css`
  position: absolute;
  top: -5px;
  left: 195px;
  display: flex;
  padding: 5px;
  border-radius: 7.5px;
  background: ${colors.GRAY_SUPER_LIGHT};
  width: min-content;
  align-items: center;
`;

export default CurrentQuantityWrapperStyle;
