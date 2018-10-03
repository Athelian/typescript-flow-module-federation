// @flow
import { css } from 'react-emotion';
import { colors, presets } from 'styles/common';

export const MessageInputWrapper: string = css`
  position: relative;
  display: flex;
  flex: 1;
  padding: 0 40px 10px 40px;
  background-color: ${colors.WHITE};
`;

export const SendButtonStyle = (isSendable: boolean) => css`
  position: absolute;
  top: 0;
  right: 0;
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  ${presets.BUTTON};
  color: ${isSendable ? colors.TEAL : colors.GRAY_LIGHT};
  cursor: ${isSendable ? 'pointer' : 'default'};
`;
