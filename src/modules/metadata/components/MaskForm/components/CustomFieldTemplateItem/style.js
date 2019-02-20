// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes } from 'styles/common';

export const CustomFieldTemplateItemWrapperStyle = (
  checked: boolean,
  editable: boolean
): string => css`
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  align-items: center;
  ${editable && 'cursor: pointer'};
  & > button {
    color: ${checked ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
    ${!checked && !editable && 'opacity: 0'};
  }
  &:hover,
  :focus {
    & > button {
      color: ${checked ? colors.TEAL_DARK : colors.GRAY_LIGHT};
    }
  }
`;

export const CheckBoxStyle = (editable: boolean): string => css`
  position: absolute;
  width: 30px;
  height: 30px;
  left: -30px;
  ${presets.BUTTON};
  ${fontSizes.HUGE};
  ${!editable && 'cursor: default'};
`;
