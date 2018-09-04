// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const BatchFormWrapperStyle = css`
  width: 1060px;
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const SectionWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StatusStyle = (archived: boolean) => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};
  font-weight: bold;
  align-items: center;
`;
