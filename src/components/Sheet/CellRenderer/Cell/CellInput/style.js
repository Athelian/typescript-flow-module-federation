// @flow
import { css } from 'react-emotion';

export const WrapperStyle = (focus: boolean) => {
  return css`
    ${focus && `position: relative`};
  `;
};
