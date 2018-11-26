// @flow
import { css } from 'react-emotion';
import { shadows, scrollbars, transitions } from 'styles/common';

export const CustomFieldsFormHeaderStyle: string = css`
  padding: 0 20px;
  ${shadows.HEADER};
`;

export const CustomFieldsEditFormWrapperStyle: string = css`
  height: calc(100vh - 100px);
  min-width: min-content;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.MAIN};
  align-items: center;
  ${transitions.EXPAND};
`;

export default CustomFieldsEditFormWrapperStyle;
