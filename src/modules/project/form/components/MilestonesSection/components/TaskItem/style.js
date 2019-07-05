// @flow
import { css } from 'react-emotion';
import { presets, shadows } from 'styles/common';

export const TaskItemWrapperStyle = (isDragging: boolean) => css`
  ${presets.BUTTON};
  ${isDragging &&
    `
    ${shadows.WATERFALL};
  `}
`;

export default TaskItemWrapperStyle;
