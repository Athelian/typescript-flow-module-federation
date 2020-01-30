// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, shadows } from 'styles/common';

export const PreferenceWrapperStyle = css`
  display: flex;
  align-items: stretch;
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  margin-bottom: 10px;
  user-select: none;
  &:hover {
    ${shadows.INPUT};
    & > i {
      opacity: 1;
    }
  }
`;

export const CheckboxWrapperStyle: string = css`
  padding: 5px 5px 5px 0;
`;
