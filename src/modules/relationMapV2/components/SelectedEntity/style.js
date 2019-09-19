// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const WrapperStyle = css`
  ${presets.BOX};
  position: absolute;
  bottom: 20px;
  right: 25%;
  left: 25%;
  line-height: 40px;
  height: 40px;
  width: 500px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
`;

export default WrapperStyle;
