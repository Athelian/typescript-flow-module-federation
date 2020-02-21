// @flow
import { css } from 'react-emotion';
import {
  colors,
  fontSizesWithHeights,
  scrollbars,
  fontSizes,
  layout,
  presets,
} from 'styles/common';

export const InputWrapperStyle = css`
  ${layout.VERTICAL};
  padding-bottom: 20px;
`;

export const HeaderWrapperStyle = css`
  ${layout.HORIZONTAL};
  justify-content: space-between;
  padding: 10px 0 20px;
`;

export const TitleStyle = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  letter-spacing: 0.2em;
`;

export const ButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
  &:not([disabled]) {
    cursor: pointer;
    &:hover {
      color: ${colors.TEAL};
    }
  }
`;

export const TextAreaReadOnlyStyle = ({
  align,
  readOnlyWidth,
  readOnlyHeight,
}: {
  align: 'left' | 'right' | 'center',
  readOnlyWidth: string,
  readOnlyHeight: string,
}): string => css`
  ${fontSizesWithHeights.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: ${align};
  min-width: 0;
  width: ${readOnlyWidth};
  flex: 1;
  max-width: ${readOnlyWidth};
  height: ${readOnlyHeight};
  padding: 1px 5px;
  ${scrollbars.SMALL};
  overflow-x: hidden;
  overflow-y: auto;
  white-space: pre-wrap;
`;

export const SuggestionListStyle = css`
  & div {
    max-height: 120px;
    overflow: auto;
  }
`;
