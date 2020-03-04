// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, presets, transitions, borderRadiuses } from 'styles/common';

export const ButtonStyle = css`
  ${presets.BUTTON};
  width: 100%;
  overflow: hidden;
`;

export const CardsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  width: 100%;
  height: 30px;
  padding: 5px;
`;

export const PartnerCardStyle = css`
  ${borderRadiuses.MAIN};
  ${transitions.MAIN};
  ${presets.ELLIPSIS};
  background-color: ${colors.WHITE};
  display: flex;
  position: relative;
  overflow: hidden;
  border-bottom-right-radius: 0;
  width: 200px;
  height: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  &:hover,
  :focus {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const PartnerCodeStyle: string = css`
  ${fontSizes.SMALL};
  line-height: 20px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  padding: 0 5px;
  flex: 1;
`;

export const PlusButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 200px;
  height: 20px;
  color: rgba(0, 0, 0, 0.2);
  border: 2px dashed rgba(0, 0, 0, 0.2);
  font-size: 10px;
  &:hover,
  :focus {
    border-color: ${colors.TEAL};
    color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
