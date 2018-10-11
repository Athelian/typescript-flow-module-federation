// @flow
import { css } from 'react-emotion';
import { transitions, scrollbars, colors, fontSizes, borderRadiuses } from 'styles/common';

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
  overflow: hidden;
  ${scrollbars.SMALL_WHITE};
  &:hover {
    overflow-y: overlay;
  }
`;

export const BetaTagWrapperStyle: string = css`
  position: relative;
  overflow: hidden;
  width: 200px;
`;

export const BetaTagStyle: string = css`
  position: absolute;
  top: 0px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  ${borderRadiuses.BUTTON};
  padding: 0 2px 0 4px;
  letter-spacing: 2px;
  opacity: 0.75;
`;
