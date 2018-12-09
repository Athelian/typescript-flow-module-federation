// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, fontSizes } from 'styles/common';

export const EnumInputStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-columns: 200px 30px;
  grid-gap: 10px;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const DeleteButtonStyle: string = css`
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
