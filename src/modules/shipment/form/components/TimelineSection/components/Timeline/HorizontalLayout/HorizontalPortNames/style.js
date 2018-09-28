// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

type HorizontalDatesWrapperProps = {
  leftPadding: number,
  rightPadding: number,
};

export const HorizontalDatesWrapperStyle = ({
  leftPadding,
  rightPadding,
}: HorizontalDatesWrapperProps): string => css`
  ${layout.HORIZONTAL};
  justify-content: space-between;
  width: 100%;
  padding: 0 ${rightPadding}px 0 ${leftPadding}px;
`;

export default HorizontalDatesWrapperStyle;
