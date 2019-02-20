// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, borderRadiuses } from 'styles/common';

type DaysWrapperType = {
  align: 'left' | 'right' | 'center',
  height: string,
};

export const DaysWrapperStyle = ({ align, height }: DaysWrapperType): string => css`
  ${fontSizesWithHeights.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  ${borderRadiuses.MAIN};
  text-align: ${align};
  padding: 0 4px 0 0;
  width: min-content;
  height: ${height};
  line-height: ${height};
`;

export default DaysWrapperStyle;
