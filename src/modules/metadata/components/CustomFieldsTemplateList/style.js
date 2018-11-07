// @flow
import { css } from 'react-emotion';
import { shadows } from 'styles/common';

export const CustomFieldsFormHeaderStyle: string = css`
  padding: 0 100px;
  ${shadows.HEADER};
`;

export const CustomFieldsEditFormWrapperStyle: string = css`
  overflow-y: auto;
`;

export default CustomFieldsEditFormWrapperStyle;
