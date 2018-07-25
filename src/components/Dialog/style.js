import { css } from 'react-emotion';
import { scrollbars, presets } from 'styles/common';

export const HiddenStyle = css`
  display: none;
`;

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
  ${scrollbars.MAIN};
  z-index: 10000;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }

  animation-name: fadeIn;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
`;

export const FadeOutStyle = css`
  @keyframes fadeOut {
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

  animation-name: fadeOut;
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
`;

export const DialogStyle = css`
  ${presets.BOX};
  position: relative;
  min-width: min-content;
  margin: 0 auto;
  z-index: 10001;
`;
