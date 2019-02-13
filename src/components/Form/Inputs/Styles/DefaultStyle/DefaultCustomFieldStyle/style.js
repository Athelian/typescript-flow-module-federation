// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes } from 'styles/common';

export const DefaultCustomFieldWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const CustomFieldsWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  align-items: center;
`;

export const CustomFieldIconStyle = css`
  position: absolute;
  width: 30px;
  height: 30px;
  left: -30px;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: 1;
  color: ${colors.GRAY_LIGHT};
`;
