import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const OverlayStyle = css`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
`;

export const CardWrapperStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: rgba(255, 255, 255, 0.8);
`;

export const ActionWrapperStyle = targetted => css`
  flex: 1;
  z-index: 2;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  color: ${targetted ? colors.GRAY_DARK_1 : colors.GRAY_DARK};

  &:hover {
    color: ${targetted ? colors.GRAY_DARK_1 : colors.WHITE};
    background-color: ${colors.TEAL};
  }
  ${targetted && `background-color: ${colors.TEAL}`};
`;

export const RotateIcon = css`
  transform: rotate(90deg);
`;
