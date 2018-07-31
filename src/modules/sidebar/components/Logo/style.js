// @flow
import { css } from 'react-emotion';
import { presets, transitions } from 'styles/common';

export const LogoWrapperStyle = css`
  display: flex;
  align-items: center;
  height: 80px;
`;

export const LogoButtonWrapperStyle = css`
  ${presets.BUTTON};
  height: 100%;
`;

export const IconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  width: 50px;
  & > img {
    height: 30px;
  }
`;

export const LogoStyle = css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 100%;
  width: 120px;
  & > img {
    height: 18px;
`;

export const ToggleButtonStyle = css`
  ${presets.BUTTON} font-size: 16px;
  margin: 0 10px 0 auto;
  &:hover {
    & > svg {
      color: #ddd;
    }
  }
  & > svg {
    ${transitions.MAIN};
  }
  & > .fa-toggle-off {
    color: #eee;
  }
  & > .fa-toggle-on {
    color: #fff;
  }
`;
