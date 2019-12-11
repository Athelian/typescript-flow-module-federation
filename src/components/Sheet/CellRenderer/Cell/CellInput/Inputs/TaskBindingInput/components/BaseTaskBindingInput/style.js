// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const WrapperStyle = (readOnly: boolean) => css`
  ${layout.HORIZONTAL};
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  ${readOnly && `background: rgba(0, 0, 0, 0.1);`};
`;

export const DateWrapperStyle = (editable: boolean) => css`
  ${layout.HORIZONTAL};
  width: 132px;
  height: 30px;
  line-height: 30px;
  ${editable && `background: rgba(0, 0, 0, 0.025);`};
`;

export const DateInputStyle = css`
  font-size: 14px;
  line-height: 30px;
  align-items: center;
`;

export const IconStyle = css`
  width: 23px;
  height: 30px;
  font-weight: 900;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #cccccc;
`;

export const LabelStyle = css`
  font-size: 12px;
  line-height: 15px;
  display: flex;
  align-items: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #aaaaaa;
  padding: 0px 5px;
`;

export const ToggleStyle = css`
  font-size: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
`;
