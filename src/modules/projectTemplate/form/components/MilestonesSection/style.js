// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const MilestonesSectionWrapperStyle: string = css`
  display: flex;
  flex: 1;
  width: 100%;
  overflow-y: hidden;
  overflow-x: overlay;
  ${scrollbars.MAIN};
`;

export const PlusButtonStyle: string = css`
  width: 235px;
  display: flex;
  padding: 20px;
`;
