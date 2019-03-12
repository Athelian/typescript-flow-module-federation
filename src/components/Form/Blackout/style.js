// @flow
import { css } from 'react-emotion';
import { fontSizes, borderRadiuses } from 'styles/common';

type BlackoutWrapperType = {
  width: string,
  height: string,
};

export const BlackoutWrapperStyle = ({ width, height }: BlackoutWrapperType): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.MAIN};
  color: rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.1);
  ${borderRadiuses.MAIN};
  min-width: 0;
  width: ${width};
  max-width: ${width};
  flex: 1;
  height: ${height};
`;

export default BlackoutWrapperStyle;
