// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, borderRadiuses } from 'styles/common';

export const AddImageStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  font-size: 30px;
  color: rgba(0, 0, 0, 0.2);
  border: 5px dashed rgba(0, 0, 0, 0.2);
  background: none;
  width: 180px;
  height: 180px;
  &:hover,
  :focus {
    color: ${colors.TEAL};
    border-color: ${colors.TEAL};
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const ProgressStyle: string = css`
  ${presets.BOX};
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  width: 140px;
  height: 160px;
  color: ${colors.TEAL};
  font-size: 24px;
`;
