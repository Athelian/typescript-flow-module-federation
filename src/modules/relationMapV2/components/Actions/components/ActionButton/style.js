// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes, shadows } from 'styles/common';

export const ActionButtonWrapperStyle = (isDisabled: boolean) => css`
  position: relative;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  ${shadows.HEADER};
  color: ${colors.GRAY_DARK};
  ${isDisabled
    ? `
    background-color: ${colors.GRAY_LIGHT};
    &:hover {
      & > span {
        opacity: 1;
        width: 150px;
      }
    }
  `
    : `
    background-color: ${colors.WHITE};
    &:hover {
      color: ${colors.TEAL};
      & > span {
        opacity: 1;
        width: 150px;
      }
    }
  `}
`;

export default ActionButtonWrapperStyle;
