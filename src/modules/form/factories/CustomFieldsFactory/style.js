// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizesWithHeights, fontSizes } from 'styles/common';

export const ShowAllButtonStyle: string = css`
  ${presets.BUTTON};
  flex: 1;
  height: 30px;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  color: ${colors.GRAY_DARK};
  font-weight: bold;
  user-select: none;
  padding: 0 5px;
  justify-content: flex-end;
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;

export const CustomFieldsIconStyle: string = css`
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
`;
