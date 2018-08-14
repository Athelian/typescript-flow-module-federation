// @flow
import { css } from 'react-emotion';
import { isDataType } from 'utils/fp';

const SlideViewStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  min-height: 100%;
  background: #fff;
  box-shadow: -10px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 10001;
`;

export const SlideInStyle = (width: number | string) => css`
  ${SlideViewStyle};
  width: ${isDataType(Number, width) ? `${width}px` : width};

  @keyframes slideIn {
    from {
      right: -${width}px;
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
  ${SlideViewStyle};
  width: ${isDataType(Number, width) ? `${width}px` : width};

  @keyframes slideAway {
    from {
      right: 0;
    }
    to {
      right: -${width}px;
    }
  }

  animation-name: slideAway;
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
`;
