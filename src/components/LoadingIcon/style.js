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

export const LoadingIconStyle = (size: number) => css`
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
  width: ${size * 2}px;
  height: ${size * 2}px;
  &:after {
    content: ' ';
    display: block;
    width: ${size}px;
    height: ${size}px;
    margin: 1px;
    border-radius: 50%;
    border: ${size / 6}px solid ${colors.WHITE};
    border-color: rgba(0, 0, 0, 0.1) transparent rgba(0, 0, 0, 0.1) transparent;
    animation: spin 1.2s linear infinite;
  }
`;
