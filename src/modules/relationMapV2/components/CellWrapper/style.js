// @flow
import { css } from 'react-emotion';

export const CellWrapperStyle = (isExpandedHeading: boolean): string => css`
  padding: ${isExpandedHeading ? '20px 0 0 0' : '10px 0'};
`;

export default CellWrapperStyle;
