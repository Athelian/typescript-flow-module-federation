// @flow
import { css } from 'react-emotion';
import { presets, colors } from 'styles/common';

export const ProductSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 0;
  display: flex;
  justify-content: center;
`;

export const TagsInputStyle: string = css`
  margin-top: 20px;
`;

export const DividerStyle: string = css`
  margin: 40px 0;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;
