// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, presets } from 'styles/common';

export const DashedPlusButtonWrapperStyle = (width: string, height: string) => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  font-size: 30px;
  color: rgba(0, 0, 0, 0.2);
  border: 5px dashed rgba(0, 0, 0, 0.2);
  background: none;
  width: ${width};
  height: ${height};
  &:hover,
  :focus {
    color: ${colors.TEAL};
    border-color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export default DashedPlusButtonWrapperStyle;
