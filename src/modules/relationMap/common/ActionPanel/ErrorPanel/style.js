import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const ContainerWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 10px;
  letter-spacing: 2px;
  color: ${colors.WHITE};
  background-color: ${colors.RED};
`;

export const TryAgaingButton = css`
  cursor: pointer;
  user-select: none;
  color: ${colors.WHITE};
  &:hover {
    color: ${colors.WHITE};
  }
`;

export const CancelButtonStyle = css`
  cursor: pointer;
  user-select: none;
  color: ${colors.WHITE};
  &:hover {
    color: ${colors.WHITE};
  }
`;

export default ContainerWrapper;
