// @flow
import { css } from 'react-emotion';
import { fontSizes, colors } from 'styles/common';

type GridViewWrapperProps = {
  itemWidth: string,
  columnGap: string,
  rowGap: string,
};

export const GridViewWrapperStyle = ({
  itemWidth,
  columnGap,
  rowGap,
}: GridViewWrapperProps): string => css`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, ${itemWidth});
  grid-auto-rows: min-content;
  grid-column-gap: ${columnGap};
  grid-row-gap: ${rowGap};
  padding: 50px 20px;
`;

export const EmptyMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;
