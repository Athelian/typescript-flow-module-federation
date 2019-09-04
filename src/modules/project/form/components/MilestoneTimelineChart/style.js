// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const ProjectCardBodyStyle = (numOfMilestones: number): string => css`
  display: grid;
  grid-auto-columns: minmax(143.75px, 1fr);
  grid-auto-flow: column;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: overlay;
  padding: 10px 35px;
  ${scrollbars.SMALL};
  ${numOfMilestones > 6 &&
    `
  &::after {
    content: "";
    display: block;
    width: 35px;
    height: 100%;
  }
`};
`;

export default 1;
