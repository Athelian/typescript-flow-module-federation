// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses, colors, presets, transitions } from 'styles/common';

export const Container: string = css`
  padding: 20px;
`;

export const ButtonContainer: string = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 20px;
`;

export const RightButtonsContainer: string = css`
  display: flex;
`;

export const StyledButton: string = css`
  margin-left: -12px;
  margin-right: 12px !important;
  ${presets.BUTTON};
  ${transitions.MAIN};
  font-size: 20px;
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  position: relative;
  width: 30px;
  height: 30px;
  &:hover {
    color: ${colors.GRAY_DARK};
  }
`;

export const StyledTextArea: string = css`
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  padding: 6.5px 11px;
  resize: vertical;
  &:focus {
    border-color: #35deb4;
  }
`;

export const ActiveStyle: string = css`
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.RED};
  position: absolute;
  width: 10px;
  height: 10px;
  top: 0px;
  right: 0px;
`;

export const InputWrapper: string = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 20px 20px 0 20px;
  div {
    margin-bottom: 4px;
  }
`;

export const CheckboxWrapper: string = css`
  display: flex;
  div {
    margin-left: 6px;
  }
`;

export const ButtonWrapper: string = css`
  .ant-btn: {
    margin: 0 !important;
  }
`;

export const SelectWrapper: string = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 220px;
  grid-gap: 10px;
  & > div {
    ${layout.VERTICAL};
  }
  margin-bottom: 10px;
`;
