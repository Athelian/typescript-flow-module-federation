// @flow
import { css } from 'react-emotion';

const SlideViewWrapperStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  background: #fff;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 10001;
`;

export const SlideInStyle = (width: string) => css`
  ${SlideViewWrapperStyle};
  width: ${width};

  @keyframes slideIn {
    from {
      right: -${width};
    }
    to {
      right: 0;
    }
  }

  animation-name: slideIn;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
`;

export const SlideAwayStyle = (width: number | string) => css`
  ${SlideViewWrapperStyle};
  width: ${width};

  @keyframes slideAway {
    from {
      right: 0;
    }
    to {
      right: -${width};
    }
  }

  animation-name: slideAway;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
`;

export const SlideViewContentStyle = css`
  position: relative;
`;

const BackdropStyle = css`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

export const BackdropFadeInStyle = css`
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

export const BackdropFadeOutStyle = css`
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
