// @flow
import { css } from 'react-emotion';
import {
  colors,
  scrollbars,
  fontSizes,
  layout,
  presets,
  borderRadiuses,
  shadows,
  transitions,
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

export const MentionsInputStyle: string = css`
  text-align: left;
  height: 100%;
  width: 100%;
  flex: 1;
  padding: 1px 5px;
  ${scrollbars.SMALL};
  overflow-x: hidden;
  overflow-y: auto;
  white-space: pre-wrap;
  & textarea,
  div {
    border: none;
    ${fontSizes.MAIN} !important;
    font-weight: bold;
    color: ${colors.BLACK};
  }
  & textarea {
    padding: 1px 5px;
    &::placeholder {
      color: ${colors.GRAY_LIGHT};
    }
  }
`;

export const MentionStyle: string = css`
  background-color: ${colors.TEAL};
  opacity: 0.25;
  ${borderRadiuses.MAIN};
`;

export const SuggestionListStyle: string = css`
  & > div {
    overflow: auto;
    ${shadows.INPUT};
    background: ${colors.WHITE};
    ${borderRadiuses.MAIN};
    max-height: 140px;
    width: 200px;
    ${scrollbars.SMALL};
    cursor: pointer;
  }
`;

export const MentionSuggestionStyle = (isHighlighted: boolean): string => css`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 5px;
  max-width: 100%;
  background-color: ${isHighlighted ? colors.GRAY_SUPER_LIGHT : colors.TRANSPARENT};
  ${transitions.MAIN};
`;

export const MentionSuggestionNameWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  padding: 0 0 0 5px;
`;

export const MentionNameStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  & b {
    color: ${colors.TEAL};
  }
`;

export const MentionCompanyStyle: string = css`
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  ${presets.ELLIPSIS};
`;
