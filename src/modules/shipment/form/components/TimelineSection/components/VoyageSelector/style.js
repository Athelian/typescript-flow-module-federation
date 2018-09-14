// @flow
import { css } from 'react-emotion';
import { presets, colors } from 'styles/common';

export const VoyageSelectorWrapperStyle = css`
  ${presets.BUTTON};
  width: 100%;
  height: 50px;
  border-top: 1px solid ${colors.GRAY_VERY_LIGHT};
  flex-shrink: 0;
`;

export default VoyageSelectorWrapperStyle;
