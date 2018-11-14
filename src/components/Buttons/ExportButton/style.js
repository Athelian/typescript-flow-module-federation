// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, shadows, fontSizes } from 'styles/common';

export const WrapperStyle = css`
  position: relative;
`;

export const DropDownStyle = css`
  position: absolute;
  top: 40px;
  display: flex;
  flex-direction: column;
  ${shadows.INPUT};
  background: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  overflow: hidden;
`;

export const ItemStyle = css`
  ${presets.BUTTON};
  justify-content: left;
  height: 30px;
  padding: 5px;
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  white-space: nowrap;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const ItemIconStyle = css`
  margin: 0 5px 0 0;
  ${fontSizes.SMALL};
`;

export const ButtonStyle = css`
  ${borderRadiuses.MAIN};
  border: 1px solid ${colors.GRAY_LIGHT};
`;
