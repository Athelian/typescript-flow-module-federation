// @flow
import { css } from 'react-emotion';
import { presets, colors } from 'styles/common';

export const WrapperStyle = css`
  display: flex;
`;

export const ActiveStyle = (isActive: boolean) => css`
  ${presets.BUTTON};
  height: 40px;
  padding: 0 5px;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 2px;
  color: ${isActive ? colors.BLUE : colors.GRAY};
  border-bottom: 4px solid ${isActive ? colors.BLUE : `${colors.TRANSPARENT}`};
  outline: none;
  &:hover {
    border-color: ${isActive ? colors.BLUE : colors.GRAY_LIGHT};
  }
  &:focus {
    color: ${isActive ? colors.BLUE_DARK : colors.GRAY_DARK};
    border-color: ${isActive ? colors.BLUE_DARK : colors.GRAY};
  }
`;

export const ArchivedStyle = (isActive: boolean) => css`
  ${presets.BUTTON};
  height: 40px;
  padding: 0 5px;
  margin-left: 5px;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 2px;
  color: ${isActive ? colors.GRAY : colors.BLUE};
  border-bottom: 4px solid ${isActive ? `${colors.TRANSPARENT}` : colors.BLUE};
  outline: none;
  &:hover {
    border-color: ${isActive ? colors.GRAY_LIGHT : colors.BLUE};
  }
  &:focus {
    color: ${isActive ? colors.GRAY_DARK : colors.BLUE_DARK};
    border-color: ${isActive ? colors.GRAY : colors.BLUE_DARK};
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
