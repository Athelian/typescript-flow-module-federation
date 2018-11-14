// @flow
import { css } from 'react-emotion';

import { presets } from 'styles/common';

export const ContentWrapperStyle = (width: string): string => css`
  width: ${width};
  ${presets.BOX};
`;

export default ContentWrapperStyle;
