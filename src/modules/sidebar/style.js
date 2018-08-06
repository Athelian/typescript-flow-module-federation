import { css } from 'react-emotion';
import { transitions, gradients, scrollbars } from 'styles/common';

export const MenuBody = css`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  overflow: hidden;
  ${scrollbars.SMALL_WHITE};
  &:hover {
    overflow-y: overlay;
  }
`;

export const zenMenuStyle = isExpanded => css`
  position: fixed;
  top: 0;
  z-index: 9999;
  user-select: none;
  overflow: hidden;
  height: 100vh;
  width: ${isExpanded ? '200px' : '50px'};
  background: ${gradients.BLUE_TEAL_VERTICAL};
  ${transitions.EXPAND};
  &:hover {
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
    width: 200px;
  }
`;
