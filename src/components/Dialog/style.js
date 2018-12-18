// @flow
import { css } from 'react-emotion';
import { scrollbars, presets } from 'styles/common';

const BackdropStyle: string = css`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  overflow-y: overlay;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  ${scrollbars.MAIN};
  z-index: 10000;
`;

export const BackdropFadeInStyle: string = css`
  ${BackdropStyle};

  @keyframes appear {
    from {
      opacity: 0;
    }
  }

  animation-name: appear;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;

export const BackdropFadeOutStyle: string = css`
  ${BackdropStyle};

  @keyframes dissappear {
    from {
      background-color: rgba(0, 0, 0, 0.3);
    }
    to {
      opacity: 0;
      z-index: -1;
    }
  }

  animation-name: dissappear;
  animation-timing-function: ease-out;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
`;

export const DialogFadeInStyle = (width: string): string => css`
  ${presets.BOX};
  width: ${width};
  z-index: 10001;

  @keyframes fadeIn {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
  }

  animation-name: fadeIn;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;

export const DialogFadeOutStyle = (width: string): string => css`
  ${presets.BOX};
  width: ${width};

  @keyframes fadeAway {
    to {
      transform: translateY(100px);
      opacity: 0;
      z-index: -1;
    }
  }

  animation-name: fadeAway;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;
