// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes, borderRadiuses, shadows, transitions } from 'styles/common';

export const BodyWrapperStyle: string = css`
  display: flex;
  flex-align: center;
  justify-content: center;
  width: 615px;
  height: 284px;
`;

export const ContentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 195px 400px;
  grid-gap: 20px;
`;

export const StarStyle = (isDefault: boolean): string => css`
  color: ${isDefault ? colors.TEAL : colors.GRAY};
  padding: 5px;
`;

export const SelectInputStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  ${borderRadiuses.MAIN};
  border: 1px solid ${isOpen ? colors.TEAL : 'rgba(0, 0, 0, 0.1)'};
  width: 200px;
  height: 30px;
  &:hover,
  &:focus {
    ${shadows.INPUT};
    & > i {
      color: ${colors.TEAL};
    }
  }
`;

export const SelectTextStyle = (hasValue: boolean): string => css`
  ${presets.ELLIPSIS};
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
