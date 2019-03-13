// @flow
import { css } from 'react-emotion';
import { layout, presets } from 'styles/common';

export const FormContentWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const CommonSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;

export const DescriptionLabelWrapperStyle: string = css`
  height: 90px;
`;

export const AssignedToStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;
