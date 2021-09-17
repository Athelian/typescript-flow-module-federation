// @flow
import { css } from 'react-emotion';
import { layout, presets, colors } from 'styles/common';

export const ProductProviderSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MainFieldsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
  padding: 0 100px;
  grid-gap: 60px;
`;

export const DividerStyle: string = css`
  margin: 40px 0;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;
