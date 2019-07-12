// @flow
import { css } from 'react-emotion';
import { layout, colors } from 'styles/common';

export const WrapperStyle = css`
  ${layout.HORIZONTAL};
  width: 300px;
`;

export const DefaultOptionStyle = (isDefault: boolean) => css`
  color: ${isDefault ? colors.TEAL : colors.GRAY};
  padding: 5px;
`;

export default WrapperStyle;
