// @flow
import { css } from 'react-emotion';
import { presets, colors } from 'styles/common';

export const WrapperStyle = css`
  display: flex;
  height: min-content;
  margin-bottom: -10px;
`;

const TabStyle = css`
  ${presets.BUTTON};
  height: 40px;
  padding: 0 5px;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 2px;
  outline: none;
`;

export const ActiveStyle = (isActive: boolean) => css`
  ${TabStyle};
  color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
  border-bottom: 4px solid ${isActive ? colors.TEAL : `${colors.TRANSPARENT}`};
  &:hover {
    color: ${isActive ? colors.TEAL : colors.GRAY_DARK};
    border-color: ${isActive ? colors.TEAL : colors.GRAY_DARK};
  }
  &:focus {
    color: ${isActive ? colors.TEAL : colors.GRAY_DARK};
    border-color: ${isActive && colors.TEAL};
  }
`;

export const ArchivedStyle = (isActive: boolean) => css`
  ${TabStyle};
  color: ${isActive ? colors.GRAY_LIGHT : colors.TEAL};
  border-bottom: 4px solid ${isActive ? `${colors.TRANSPARENT}` : colors.TEAL};
  &:hover {
    color: ${isActive ? colors.GRAY_DARK : colors.TEAL};
    border-color: ${isActive ? colors.GRAY_DARK : colors.TEAL};
  }
  &:focus {
    color: ${isActive ? colors.GRAY_DARK : colors.TEAL};
    border-color: ${isActive || colors.TEAL};
  }
`;

export const TabsDisabledStyle = css`
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
