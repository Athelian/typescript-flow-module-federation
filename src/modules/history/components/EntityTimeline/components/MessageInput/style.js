// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, presets } from 'styles/common';

export const MessageInputWrapper = css`
  position: relative;
  display: flex;
  flex: 1;
`;

export const InputStyle = (hideBorder: boolean) => css`
  color: ${colors.BLACK};
  border-radius: 5px;
  border: none;
  border: ${hideBorder ? 'none' : `2px solid ${colors.GRAY_VERY_LIGHT}`};
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 10px 40px 10px 10px;
  background: #fff;
  ${transitions.MAIN};
  resize: none;
  flex: 1;
  height: auto;
  overflow: hidden;
  &:focus {
    border-color: ${colors.TEAL};
    outline: none;
  }
  &[disabled] {
    background: ${colors.GRAY_SUPER_LIGHT};
  }
  &[readonly] {
    &:focus {
      border-color: ${colors.GRAY_VERY_LIGHT};
    }
  }
`;

export const SendButtonStyle = (isSendable: boolean) => css`
  position: absolute;
  bottom: 0;
  right: 0;
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  ${presets.BUTTON};
  color: ${isSendable ? colors.TEAL : colors.GRAY_LIGHT};
  cursor: ${isSendable ? 'pointer' : 'default'};
`;
