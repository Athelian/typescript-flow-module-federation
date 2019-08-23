// @flow
import { css } from 'react-emotion';

import { colors, presets, borderRadiuses } from 'styles/common';

export const ProjectDueDateDiffToolTipStyle: string = css``;

export const TooltipGridStyle: string = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
  color: ${colors.WHITE};
`;

export const DiffDateStyle = (diff: null) => {
  let color = colors.GRAY;
  if (diff > 0) {
    color = colors.RED;
  } else if (diff < 0) {
    color = colors.TEAL;
  }

  return css`
    color: ${color};
    background-color: ${colors.WHITE};
    height: 20px;
    ${presets.ELLIPSIS};
    ${borderRadiuses.BUTTON};
  `;
};
