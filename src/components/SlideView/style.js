// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const BackdropStyle = (isOpen: boolean): string => css`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
  opacity: 0;

  @keyframes appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes disappear {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  ${isOpen
    ? `
    animation-name: appear;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  `
    : `
    animation-name: disappear;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  `};
`;

export const SlideViewStyle = (isOpen: boolean, width: number, minWidth: number): string => css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.1);
  width: ${width}vw;
  min-width: ${minWidth}px;
  right: -100%;

  @keyframes slideIn {
    from {
      right: -100%;
    }
    to {
      right: 0;
    }
  }

  @keyframes slideAway {
    from {
      right: 0;
    }
    to {
      right: -100%;
    }
  }

  ${isOpen
    ? `
    animation-name: slideIn;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  `
    : `
    animation-name: slideAway;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  `}
`;

export const SlideViewContentStyle: string = css`
  position: relative;
`;
