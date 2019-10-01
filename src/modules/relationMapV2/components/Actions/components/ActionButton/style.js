// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

export const ActionButtonWrapperStyle = (isDisabled: boolean) => css`
  position: relative;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  color: rgba(0, 0, 0, 0.25);
  ${isDisabled
    ? `
    background-color: ${colors.GRAY_LIGHT};
    &:hover {
      & > span {
        opacity: 1;
      }
    }
  `
    : `
    background-color: ${colors.WHITE};
    &:hover {
      color: ${colors.TEAL};
      & > span {
        opacity: 1;
      }
    }
  `}
`;

export default ActionButtonWrapperStyle;
