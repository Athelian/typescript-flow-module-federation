// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes, presets } from 'styles/common';

export const CommentWrapperStyle = css`
  ${layout.HORIZONTAL};
`;

export const TimeStyle = css`
  ${fontSizes.SMALL};
  font-weight: 600;
  letter-spacing: 0.1em;
  color: ${colors.GRAY_DARK};
  width: 80px;
  padding: 2px 0 0 0;
`;

export const ContentWrapperStyle = css`
  flex: 1;
`;

export const ContentStyle = css`
  position: relative;
  ${fontSizes.MAIN};
  font-weight: 600;
  padding: 20px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.BLACK};
  border-radius: 5px 0 5px 5px;
  white-space: pre-wrap;
`;

export const EditedStyle = css`
  ${fontSizes.SMALL};
  font-weight: 600;
  letter-spacing: 0.1em;
  color: ${colors.GRAY_DARK};
`;

export const DeleteButtonStyle = css`
  ${presets.BUTTON};
  position: absolute;
  right: -25px;
  bottom: 5px;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  &:not([disabled]) {
    cursor: pointer;
    &:hover {
      color: ${colors.URGENT};
    }
  }
`;

export const ContentFigureStyle = css`
  position: relative;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 20px;
  height: 20px;
  overflow: hidden;

  &:before {
    position: absolute;
    content: '';
    background-color: ${colors.WHITE};
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

export const SuggestionListStyle = css`
  & div {
    max-height: 120px;
    overflow: auto;
  }
`;
