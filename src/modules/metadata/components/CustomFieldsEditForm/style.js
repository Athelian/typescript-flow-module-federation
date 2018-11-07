// @flow
import { css } from 'react-emotion';

import { shadows } from 'styles/common';

export const CustomFieldsEditFormWrapperStyle: string = css`
  height: calc(100vh - 50px);
  ${shadows.FAINT};
`;

export const CustomFieldsEditFormHeaderStyle: string = css`
  padding: 0 100px;
  ${shadows.HEADER};
`;

export const CustomFieldsEditFormContainerWrapperStayle: string = css`
  width: 840px;
  margin: 0 100px;
`;

export const AddButtonWrapperStyle: string = css`
  display: flex;
  justify-content: flex-end;
`;
