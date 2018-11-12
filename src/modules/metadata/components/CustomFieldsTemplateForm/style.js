// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const TemplateFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const FormFieldsStyle: string = css`
  width: 400px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  margin: 40px 100px;
`;

export default TemplateFormWrapperStyle;
