// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, presets, transitions } from 'styles/common';

export const ActionsWrapperStyle: string = css`
  display: flex;
  gap: 40px;
  > button:last-child {
    font-size: 20px;
    cursor: pointer;
  }
`;

export const ButtonStyle: string = css`
  ${presets.BUTTON};
  ${transitions.MAIN};
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_MID};
  font-size: 20px;
  position: relative;
  width: 30px;
  height: 30px;
  &:hover {
    color: ${colors.GRAY_DARK};
  }
`;

export const LastModifiedWrapperStyle: string = css`
  display: flex;
  align-items: center;
`;

export const MetadataWrapperStyle: string = css`
  display: flex;
  gap: 20px;
`;

export const NameWrapperStyle: string = css`
  column-gap: 8px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  > svg {
    color: ${colors.GRAY_DARK};
    ${fontSizes.LARGE};
  }
`;

export const SectionWrapperStyle: string = css`
  ${presets.BOX};
  ${fontSizes.MAIN};
  width: 100%;
  max-width: unset;
  padding: 30px;
  display: flex;
  column-gap: 40px;
  justify-content: space-between;
  margin-top: 30px;
`;
