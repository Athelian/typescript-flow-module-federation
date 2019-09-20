// @flow
import { css } from 'react-emotion';
import { transitions, scrollbars, colors } from 'styles/common';

export const SideBarWrapperStyle = (isExpanded: boolean): string => css`
  @keyframes gradient {
    0% {
      background-position: 50% 0%;
    }
    50% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 50% 0%;
    }
  }
  position: fixed;
  top: 0;
  z-index: 9999;
  user-select: none;
  overflow: hidden;
  height: 100vh;
  width: ${isExpanded ? '200px' : '50px'};
  background: linear-gradient(0deg, ${colors.BLUE}, ${colors.TEAL});
  background-size: 400% 400%;
  animation: gradient 60s ease infinite;
  ${transitions.EXPAND};
  &:hover {
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
    width: 200px;
  }
`;

export const SideBarBodyStyle: string = css`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.SMALL_WHITE};
`;
