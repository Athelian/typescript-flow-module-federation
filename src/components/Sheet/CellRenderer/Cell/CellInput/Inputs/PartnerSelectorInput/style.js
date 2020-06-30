// @flow
import { css } from 'react-emotion';
import { colors, presets, borderRadiuses, layout, fontSizes } from 'styles/common';

export const PartnerSelectorInputWrapperStyle: string = css`
  padding: 5px;
`;

export const PartnerCardStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  overflow: hidden;
  border-bottom-right-radius: 0;
  width: 100%;
  min-width: 40px;
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
  ${layout.VERTICAL};
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 100%;
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
