// @flow
import { css } from 'react-emotion';

export const ExpandStyle = (isExpand: boolean): string => css`
  display: flex;
  justify-content: space-between;
  width: ${isExpand ? '100%' : 'fit-content'};
`;

export const ExpandButtonStyle = css`
  width: 20px;
  height: 20px;
  font-size: 12px;
  text-align: center;
  color: #ccc;
  padding: 4px;
  cursor: pointer;
`;

export default ExpandStyle;
