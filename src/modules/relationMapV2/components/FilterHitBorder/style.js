// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const FilteredHitStyle = (showBlueBorder: boolean): string => css`
  position: absolute;
  top: -4px;
  left: -4px;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  border: 4px solid ${showBlueBorder ? colors.BLUE_HALF : colors.TRANSPARENT};
  border-radius: 9px;
  pointer-events: none;
  z-index: 2;
`;

export default FilteredHitStyle;
