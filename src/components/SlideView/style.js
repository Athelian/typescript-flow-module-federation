// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

type BackdropStyleProps = {
  isOpen: boolean,
  neverOpened: boolean,
};

export const BackdropStyle = ({ isOpen, neverOpened }: BackdropStyleProps): string => css`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  ${neverOpened && 'display: none'};
  z-index: 20;

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

  ${!neverOpened &&
    `${
      isOpen
        ? `
    animation-name: appear;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  `
        : `
    animation-name: disappear;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  `
    }`};
`;

type SlideViewStyleProps = {
  isOpen: boolean,
  neverOpened: boolean,
  width: string,
  minWidth: string,
};

export const SlideViewStyle = ({
  isOpen,
  neverOpened,
  width,
  minWidth,
}: SlideViewStyleProps): string => css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.1);
  width: ${width};
  min-width: ${minWidth};
  ${neverOpened && 'display: none'};

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

  ${!neverOpened &&
    `${
      isOpen
        ? `
    animation-name: slideIn;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  `
        : `
    animation-name: slideAway;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
  `
    }`};
`;

export const SlideViewContentStyle: string = css`
  position: relative;
`;
