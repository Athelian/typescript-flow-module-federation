// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const TemplateFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const FormFieldsStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  padding: 40px 100px;
  display: flex;
  justify-content: center;
`;

export const DescriptionLabelWrapperStyle: string = css`
  height: 90px;
`;

export default TemplateFormWrapperStyle;
