// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

export const AddDocumentButtonWrapperStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.WHITE};
  background-color: ${colors.TEAL};
  ${borderRadiuses.BUTTON};
  height: 30px;
  padding: 0 10px;
  width: min-content;
  min-width: 75px;
  flex-shrink: 0;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;

export const AddDocumentButtonLabelStyle: string = css`
  ${presets.ELLIPSIS};
  letter-spacing: 2px;
  ${fontSizes.SMALL};
`;

export const AddDocumentButtonIconStyle: string = css`
  margin: 0 0 0 5px;
  ${fontSizes.SMALL};
`;
