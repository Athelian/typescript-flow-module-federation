// @flow
/* eslint-disable no-unused-vars, no-redeclare */
import { css } from 'react-emotion';
import { colors, presets, layout, fontSizes } from 'styles/common';

export const ActionsWrapperStyle: string = css`
  display: flex;
  gap: 40px;
`;

export const ButtonStyle: string = css`
  color: ${colors.GRAY_MID};
  ${fontSizes.MAIN};
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
`;

export const ReminderLeftSection: string = css`
  display: flex;
  gap: 20px;
`;

export const LastModifiedWrapperStyle: string = css`
  display: flex;
`;

export const ReminderHeaderStyle: string = css`
  column-gap: 8px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  svg {
    color: ${colors.GRAY_DARK};
    ${fontSizes.LARGE};
  }
`;
