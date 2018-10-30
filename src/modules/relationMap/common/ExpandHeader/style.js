// @flow
import { css } from 'react-emotion';

export const ExpandStyle = (isExpand: boolean): string => css`
  display: flex;
  justify-content: space-between;
  width: ${isExpand ? '100%' : 'fit-content'};
`;

export default ExpandStyle;
