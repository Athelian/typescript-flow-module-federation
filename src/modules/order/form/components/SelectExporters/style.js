// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const SelectedItemStyle = (isSelected: boolean) => css`
  background: ${isSelected ? colors.TEAL : colors.WHITE};
  padding: 2px;
  cursor: pointer;
`;

export default SelectedItemStyle;
