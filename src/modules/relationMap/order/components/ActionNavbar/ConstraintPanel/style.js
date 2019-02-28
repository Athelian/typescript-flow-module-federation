// @flow
import { css } from 'react-emotion';
import { colors, shadows } from 'styles/common';

export const ConstraintPanelWrapperStyle: string = css`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.TEAL_LIGHT};
  ${shadows.HEADER};
  z-index: 1;
`;

export default ConstraintPanelWrapperStyle;
