// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const TabItemStyled: string = css`
  color: ${colors.TEAL_VERY_DARK};
  &:hover,
  &:focus {
    color: ${colors.TEAL_VERY_DARK};
    & > span {
      background-color: ${colors.TEAL_VERY_DARK};
    }
  }
`;

export const LoadingContainerStyle: string = css`
  padding: 50px 100px;
`;
export default null;
