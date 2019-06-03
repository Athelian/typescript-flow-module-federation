// @flow
import { css } from 'react-emotion';
import { borderRadiuses } from 'styles/common';

export const WrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  background-color: rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
`;

export const InlineRowStyle: string = css`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export default WrapperStyle;
