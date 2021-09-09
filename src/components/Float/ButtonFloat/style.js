// @flow
import { css } from 'react-emotion';

export const SelectedEntitiesWrapperStyle: string = (right: number) => {
  return css`
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 30px;
    right: ${right}px;
    z-index: 1;
  `;
};
