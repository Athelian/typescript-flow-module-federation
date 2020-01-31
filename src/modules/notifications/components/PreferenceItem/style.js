// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors } from 'styles/common';

export const PreferenceWrapperStyle = css`
  display: flex;
  align-items: stretch;
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  margin-bottom: 10px;
  user-select: none;
  padding: 0 0 0 30px;
`;

export const CheckboxWrapperStyle: string = css`
  padding: 5px 5px 5px 0;
`;
