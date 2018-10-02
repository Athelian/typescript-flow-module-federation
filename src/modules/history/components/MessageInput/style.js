// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, presets, scrollbars } from 'styles/common';

export const MessageInputWrapper: string = css`
  position: relative;
  display: flex;
  flex: 1;
`;

export const InputStyle: string = css`
  color: ${colors.BLACK};
  border: none;
  ${fontSizes.MAIN};
  font-weight: bold;
  padding: 10px 40px 10px 10px;
  background: ${colors.WHITE};
  ${transitions.MAIN};
  resize: none;
  flex: 1;
  min-height: 38px;
  height: auto;
  overflow: overlay;
  max-height: 200px;
  ${scrollbars.SMALL};
  box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1);
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
