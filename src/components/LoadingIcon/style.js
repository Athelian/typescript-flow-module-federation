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

export const LoadingStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: rotate(30deg);
`;

export const RowStyle: string = css`
  display: flex;
`;

export const TriangleStyle: string = css`
  @keyframes blink {
    0% {
      opacity: 0.1;
    }
    30% {
      opacity: 1;
    }
    100% {
      opacity: 0.1;
      border-bottom: 21.6px solid ${colors.TEAL};
    }
  }
  width: 0;
  height: 0;
  margin: 0 -6px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 21.6px solid ${colors.BLUE};
  animation: blink 1s infinite;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
`;

export const FlipStyle: string = css`
  transform: rotate(180deg);
`;

export const InnerStyle = (i: number): string => css`
  animation-delay: ${-(1 / 6) * i}s;
`;

export const OuterStyle = (i: number): string => css`
  animation-delay: ${-(1 / 18) * i}s;
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
  display: inline-block;
  width: 64px;
  height: 64px;
  &:after {
    content: ' ';
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #fff;
    border-color: rgba(0, 0, 0, 0.1) transparent rgba(0, 0, 0, 0.1) transparent;
    animation: spin 1.2s linear infinite;
  }
`;
