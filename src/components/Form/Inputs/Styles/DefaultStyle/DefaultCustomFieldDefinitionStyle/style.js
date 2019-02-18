// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes } from 'styles/common';

export const DefaultCustomFieldDefinitionWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  &:hover {
    & > div {
      & > button,
      div {
        opacity: 1;
      }
    }
  }
`;

export const CustomFieldWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  align-items: center;
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
  right: 0;
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  opacity: 0;
  color: ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;
