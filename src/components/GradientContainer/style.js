// @flow
import { css } from 'react-emotion';
import { transitions, colors } from 'styles/common';

export const GradientStyle: string = css`
  @keyframes gradient {
    0% {
      background-position: 50% 0%;
    }
    50% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 50% 0%;
    }
  }
  background: linear-gradient(0deg, ${colors.BLUE}, ${colors.TEAL});
  background-size: 400% 400%;
  animation: gradient 60s ease infinite;
  ${transitions.EXPAND};
`;

export default GradientStyle;
