// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

export const CloneButtonWrapperStyle: string = css`
  position: absolute;
  right: -40px;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  color: ${colors.WHITE};
  ${fontSizes.MAIN};
  background-color: rgba(0, 0, 0, 0.1);
  &:hover,
  :focus {
    background-color: ${colors.BLUE};
  }
`;

export default CloneButtonWrapperStyle;
