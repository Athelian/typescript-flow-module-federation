// @flow
import { css } from 'react-emotion';

type GridViewWrapperProps = {
  itemWidth: string,
  columnGap: string,
  rowGap: string,
  padding: string,
};

export const GridViewWrapperStyle = ({
  itemWidth,
  columnGap,
  rowGap,
  padding,
}: GridViewWrapperProps): string => css`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, ${itemWidth});
  grid-auto-rows: min-content;
  grid-column-gap: ${columnGap};
  grid-row-gap: ${rowGap};
  padding: ${padding};
  justify-content: center;
`;

export default GridViewWrapperStyle;
