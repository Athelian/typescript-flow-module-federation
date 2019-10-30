// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes } from 'styles/common';

export const ToggleInputWrapperStyle = (booked: boolean): string => css`
  ${presets.ELLIPSIS};
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${booked ? colors.TEAL : colors.GRAY};
  ${fontSizes.MAIN};
  font-weight: bold;
  align-items: center;
  height: 30px;
  padding: 0 5px;
`;

export default ToggleInputWrapperStyle;
