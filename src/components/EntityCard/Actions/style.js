// @flow
import { css } from 'react-emotion';

export const WrapperStyle = css`
  display: flex;
  position: absolute;
  bottom: calc(100% + 5px);
  right: 0;
  &:hover {
    div {
      margin-left: 5px;
      animation: none;
    }
  }
`;

export const DefaultStyle = css`
  display: none;
`;

export const FadeInStyle = (index: number) => css`
  @keyframes fadeIn {
    from {
      opacity: 0;
      margin-bottom: -50px;
      transform: scale(0, 0);
      z-index: -1;
    }
    to {
      opacity: 1;
      margin-left: 5px;
      z-index: 1;
    }
  }

  animation-name: fadeIn;
  animation-duration: ${(3 - index) / 10}s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
`;

export const FadeOutStyle = (index: number) => css`
  margin-left: 5px;

  @keyframes fadeOut {
    to {
      z-index: -1;
      margin-bottom: -35px;
      transform: scale(0.2, 0.2);
      opacity: 0;
    }
  }

  animation-name: fadeOut;
  animation-duration: 0.2s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  animation-delay: ${index / 10}s;
`;
