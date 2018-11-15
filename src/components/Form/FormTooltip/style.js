// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const TooltipRelativeWrapperStyle: string = css`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MessageStyle: string = css`
  width: 100%;
`;

const ValueStyle: string = css`
  ${presets.ELLIPSIS};
  width: 100%;
  text-align: center;
`;

export const UpperMessageStyle: string = css`
  ${MessageStyle};
`;

export const OldValueStyle: string = css`
  ${ValueStyle};
`;

export const ArrowDownStyle: string = css`
  display: flex;
  justify-content: center;
  align-items: center;
  ${fontSizes.SMALL};
`;

export const NewValueStyle: string = css`
  ${ValueStyle};
`;

export const InfoMessageStyle: string = css`
  ${MessageStyle};
`;

export const DividerStyle: string = css`
  height: 1px;
  width: 100%;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 5px 0;
`;
