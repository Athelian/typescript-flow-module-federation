// @flow
import { css } from 'react-emotion';
import { scrollbars, presets } from 'styles/common';

export const BackdropStyle = css`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 100px;
  overflow-y: overlay;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  ${scrollbars.MAIN};
  z-index: 10000;

  @keyframes appear {
    from {
      opacity: 0;
    }
  }

  animation-name: appear;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;

export const BackDropFadeOutStyle = css`
  @keyframes dissappear {
    from {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.3);
    }
    to {
      opacity: 0;
    }
  }

  animation-name: dissappear;
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
`;

export const DialogStyle = (contentWidth: number) => css`
  ${presets.BOX};
  z-index: 10001;

  @keyframes fadeIn {
    from {
      transform: translateY(100px);
      scale(0, 0);
      opacity: 0;
    }
    to {
      width: ${contentWidth}px;
    }
  }

  animation-name: fadeIn;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;

export const DialogFadeOutStyle = (contentWidth: number) => css`
  @keyframes fadeAway {
    from {
      width: ${contentWidth}px;
    }
    to {
      transform: translateY(100px);
      opacity: 0;
    }
  }

  animation-name: fadeAway;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;
