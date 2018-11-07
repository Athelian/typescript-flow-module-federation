// @flow
import { css } from 'react-emotion';

import { shadows } from 'styles/common';

export const CustomFieldsEditFormWrapperStyle: string = css`
  height: calc(100vh - 50px);
  ${shadows.FAINT};
`;

export const CustomFieldsEditFormContainerWrapperStayle: string = css`
  margin: 0 20px;
`;

export const AddButtonWrapperStyle: string = css`
  display: flex;
  justify-content: flex-end;
`;
