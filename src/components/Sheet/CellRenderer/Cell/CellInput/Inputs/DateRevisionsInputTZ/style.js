// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, borderRadiuses, presets, transitions } from 'styles/common';

export const DateRevisionsWrapperStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 30px;
  overflow: hidden;
`;

export const RevisionWrapperStyle = css`
  display: grid;
  grid-template-columns: 80px 1px 130px 30px;
  height: 30px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  width: 241px;
`;

export const SelectInputStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  width: 80px;
  height: 100%;
  & > span {
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    color: ${colors.BLACK};
    text-align: left;
    font-weight: bold;
    padding: 0 5px;
    flex: 1;
  }
  & > i {
    ${transitions.EXPAND};
    ${fontSizes.SMALL};
    color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
    height: 100%;
    padding: 0 5px 0 0;
  }
  &:focus > i {
    color: ${colors.TEAL};
  }
`;

export const SeparatorStyle = css`
  height: 20px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
  flex-shrink: 0;
  margin: 5px 0;
`;

export const RemoveButtonStyle = css`
  ${presets.BUTTON};
  color: rgba(0, 0, 0, 0.1);
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;

export const AddButtonStyle = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors.WHITE};
  background-color: ${colors.TEAL};
  letter-spacing: 2px;
  text-transform: uppercase;
  height: 20px;
  width: min-content;
  padding: 0 10px;
  margin: 0 5px;
  flex-shrink: 0;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;
