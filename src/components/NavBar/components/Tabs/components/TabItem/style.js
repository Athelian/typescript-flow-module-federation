// @flow
import { css } from 'react-emotion';
import { presets, colors } from 'styles/common';

const TabStyle = css`
  ${presets.BUTTON};
  height: 40px;
  padding: 0 5px;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 2px;
  outline: none;
  & > span {
    margin-right: 5px;
  }
`;

export const TabItemStyle = (isActive: boolean) => css`
  ${TabStyle};
  color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
  border-bottom: 4px solid ${isActive ? colors.TEAL : `${colors.TRANSPARENT}`};
  transition: 0.2s;
  &:hover {
    color: ${isActive ? colors.TEAL : colors.GRAY_DARK};
    border-color: ${isActive ? colors.TEAL : colors.GRAY_DARK};
  }
  &:focus {
    color: ${isActive ? colors.TEAL : colors.GRAY_DARK};
    border-color: ${isActive && colors.TEAL};
  }
`;

export const DisabledStyle = css`
  ${presets.BUTTON};
  cursor: default;
  height: 40px;
  padding: 0 5px;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.GRAY};
  border-bottom: 4px solid ${colors.TRANSPARENT};
  & > svg {
    margin: 0 0 0 5px;
  }
`;
