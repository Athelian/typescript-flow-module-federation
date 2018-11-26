// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const TemplateListWrapperStyle: string = css`
  overflow-y: overlay;
  ${scrollbars.MAIN};
`;

export default TemplateListWrapperStyle;
