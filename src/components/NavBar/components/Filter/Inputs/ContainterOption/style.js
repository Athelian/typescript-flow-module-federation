// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, presets, transitions, shadows } from 'styles/common';

export const SelectInputStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  ${borderRadiuses.MAIN};
  border: 1px solid ${isOpen ? colors.TEAL : 'rgba(0, 0, 0, 0.1)'};
  width: 100%;
  height: 30px;
  cursor: pointer;

  &:hover,
  &:focus {
    ${shadows.INPUT};

    & > i {
      color: ${colors.TEAL};
    }
  }
`;

export const SelectTextStyle = (hasValue: boolean): string => css`
  color: ${hasValue ? colors.BLACK : colors.GRAY_LIGHT};
  padding: 0 5px;
  text-align: left;
  font-weight: bold;
  flex: 1;
`;

export const ArrowDownStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  ${fontSizes.SMALL};
  color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
  width: 30px;
  cursor: pointer;
`;
