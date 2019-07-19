// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, fontSizes } from 'styles/common';

export const LogsButtonWrapperStyle: string = css`
  position: relative;
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  background-color: ${colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  height: 30px;
  width: 80px;
  padding: 0 10px;
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  width: min-content;
  ${presets.ELLIPSIS};
  overflow: unset;
  & > svg {
    margin-right: 5px;
  }
  &:hover,
  :focus {
    background-color: ${colors.BLUE};
  }
`;

export const BadgeStyle: string = css`
  position: absolute;
  border-radius: 8px;
  background-color: ${colors.RED};
  color: #fff;
  line-height: 12px;
  letter-spacing: 0px;
  ${fontSizes.SMALL};
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  top: -4px;
  right: -4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
