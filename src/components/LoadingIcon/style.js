// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const LoadingWrapperStyle: string = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoadingIconStyle: string = css`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  &:after {
    content: ' ';
    display: block;
    width: 20px;
    height: 20px;
    margin: 1px;
    border-radius: 50%;
    border: 3px solid ${colors.WHITE};
    border-color: rgba(0, 0, 0, 0.1) transparent rgba(0, 0, 0, 0.1) transparent;
    animation: spin 1.2s linear infinite;
  }
`;
