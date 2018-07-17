import { css } from 'react-emotion';
import { presets, colors } from 'styles/common';

export const TabButtonStyle = isActive => css`
  ${presets.BUTTON};
  height: 40px;
  padding: 0 5px;
  margin: 0 5px;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 2px;
  color: ${isActive ? colors.TEAL : colors.GRAY};
  border-bottom: 4px solid ${isActive ? colors.TEAL : colors.TRANSPARENT};
  &:hover {
    border-color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
  }
  &:focus {
    color: ${isActive ? colors.TEAL_DARK : colors.GRAY_DARK};
    border-color: ${isActive ? colors.TEAL_DARK : colors.GRAY};
  }
`;

export const TabButtonDisabledStyle = css`
  ${presets.BUTTON};
  cursor: default;
  height: 40px;
  padding: 0 5px;
  margin: 0 5px;
  white-space: nowrap;
  font-size: 12px;
  letter-spacing: 2px;
  color: ${colors.GRAY};
  border-bottom: 4px solid ${colors.TRANSPARENT};
  & > svg {
    margin: 0 0 0 5px;
  }
`;
