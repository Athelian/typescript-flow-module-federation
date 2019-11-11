// @flow
import { css } from 'react-emotion';
import { borderRadiuses, layout, shadows, colors, presets, fontSizes } from 'styles/common';

export const ButtonStyle = css`
  ${borderRadiuses.MAIN};
`;

export const ModalWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const HeaderStyle: string = css`
  ${layout.VERTICAL};
  position: sticky;
  top: -100px;
  z-index: 1;
`;

export const ActionsWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${shadows.HEADER};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  justify-content: space-between;
  height: 50px;
  padding: 0 20px;
  z-index: 2;
`;

export const ButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
`;

export const TemplateWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${shadows.HEADER};
  background-color: ${colors.GRAY_VERY_LIGHT};
  position: sticky;
  height: 50px;
  padding: 10px 20px;
  justify-content: space-between;
`;

export const TemplateSelectWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 15px;
`;

export const SelectTemplateStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  ${fontSizes.HUGE};
  color: rgba(0, 0, 0, 0.2);
  border: 3px dashed rgba(0, 0, 0, 0.2);
  background: none;
  width: 120px;
  height: 30px;
  &:hover,
  :focus {
    color: ${colors.TEAL};
    border-color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const TemplateStyle: string = css`
  ${presets.BUTTON};
  ${presets.BOX};
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  position: relative;
  width: 120px;
  height: 30px;
  padding: 5px 20px 5px 5px;

  & > div {
    position: absolute;
    top: 0;
    right: 0;
  }
`;
