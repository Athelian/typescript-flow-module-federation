// @flow
import { css } from 'react-emotion';
import { presets, scrollbars } from 'styles/common';

export const MilestonesSectionWrapperStyle: string = css`
  ${presets.BOX};
  display: flex;
  flex: 1;
  width: 880px;
  padding: 40px 0;
  overflow-y: hidden;
  overflow-x: overlay;
  ${scrollbars.MAIN};
`;

export const PlusButtonStyle: string = css`
  width: 235px;
  display: flex;
  padding: 20px;
`;
