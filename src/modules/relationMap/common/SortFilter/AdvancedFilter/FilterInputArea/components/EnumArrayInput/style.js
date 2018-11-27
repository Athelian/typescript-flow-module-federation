// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, fontSizes } from 'styles/common';

export const EnumArrayInputWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-template-columns: 200px;
  grid-gap: 20px;
`;

export const EnumInputStyle: string = css`
  position: relative;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const DeleteButtonStyle: string = css`
  position: absolute;
  right: -30px;
  top: 0;
  ${presets.BUTTON};
  opacity: 0;
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    opacity: 1;
    color: ${colors.RED};
  }
`;
