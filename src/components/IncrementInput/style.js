// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes, borderRadiuses, transitions } from 'styles/common';

export const IncrementInputWrapperStyle: string = css`
  @keyframes incrementInputSlide {
    from {
      opacity: 0;
      top: 20%;
    }
    to {
      top: 50%;
      opacity: 1;
    }
  }
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 14px;
  width: calc(100% - 28px);
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  z-index: 1;
  align-items: center;
  background-color: ${colors.WHITE};
  padding: 5px;
  ${borderRadiuses.BUTTON};
  ${transitions.MAIN};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  animation-name: incrementInputSlide;
  animation-duration: 0.3s;
  &:hover {
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
  }
`;

export const IncrementButtonStyle: string = css`
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  &:hover,
  :focus {
    color: ${colors.TEAL};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const IncrementContentStyle: string = css`
  color: ${colors.BLACK};
  ${fontSizes.HUGE};
  text-align: center;
  font-weight: bold;
  ${presets.ELLIPSIS} width: 100%;
  ${borderRadiuses.BUTTON};
  cursor: default;
  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
