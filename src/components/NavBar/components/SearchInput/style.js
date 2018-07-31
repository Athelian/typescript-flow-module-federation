// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses, fontSizes, transitions, presets } from 'styles/common';

export const WrapperStyle = (focus: boolean, expand: boolean) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  position: relative;
  overflow: hidden;
  background: #fff;
  ${borderRadiuses.BUTTON};
  color: ${colors.GRAY_LIGHT};
  width: ${focus || expand ? '200px' : '30px'};
  height: 30px;
  ${fontSizes.MAIN};
  ${transitions.MAIN};
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    width: 200px;
  }

  & > svg {
    padding: 0 5px;
  }
`;

export const InputStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  background: none;
  border: none;
  font-weight: bold;
  width: 100%;
  outline: none;
`;

export const ClearButtonStyle = css`
  ${presets.BUTTON};
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  padding: 5px;
  outline: none;
  &:hover {
    color: ${colors.BLACK};
  }
`;
