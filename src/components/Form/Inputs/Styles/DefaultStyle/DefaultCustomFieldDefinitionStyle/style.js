// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes } from 'styles/common';

export const DefaultCustomFieldDefinitionWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  align-items: center;
  &:hover {
    & > button,
    div {
      opacity: 1;
    }
  }
`;

export const DraggingIconStyle = css`
  position: absolute;
  width: 30px;
  height: 30px;
  left: -30px;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: 0;
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.BLUE};
    opacity: 1;
  }
`;

export const CustomFieldIconStyle = css`
  position: absolute;
  width: 30px;
  height: 30px;
  left: -30px;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: 1;
  color: ${colors.GRAY_LIGHT};
  cursor: default;
`;

export const RemoveButtonStyle: string = css`
  position: absolute;
  width: 30px;
  height: 30px;
  right: -30px;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: 0;
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.RED};
    opacity: 1;
  }
`;
