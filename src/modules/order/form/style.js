// @flow
import { css } from 'react-emotion';
import { presets, transitions, colors, borderRadiuses, layout } from 'styles/common';

export const WrapperStyle = css`
  width: 1060px;
  margin: 80px auto;
  display: flex;
  flex-direction: column;
  & > div {
    width: 960px;
    margin-bottom: 80px;
  }
`;

export const UpdatedAtStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  color: ${colors.GRAY};
  margin-right: 50px;
  span {
    color: ${colors.BLACK};
    margin: 5px;
  }
`;

export const UserIconStyle = css`
  display: flex;
  ${layout.CENTER_CENTER};
  color: #fff;
  width: 30px;
  height: 30px;
  ${borderRadiuses.CIRCLE};
  background: #aaa;
  img {
    object-fit: cover;
  }
`;

export const StatusStyle = (active: boolean) => css`
  color: ${active ? colors.TEAL : colors.GRAY};
  svg {
    margin-right: 5px;
  }
`;

export const ToggleButtonStyle = css`
  ${presets.BUTTON};
  font-size: 30px;
  margin: 0 0 0 10px;
  &:hover {
    & > svg {
      opacity: 0.8;
    }
  }
  & > svg {
    ${transitions.MAIN};
  }
  & > .fa-toggle-off {
    color: #eee;
  }
  & > .fa-toggle-on {
    color: ${colors.TEAL};
  }
`;

export const HeaderRightStyle = css`
  display: flex;
  align-items: center;
`;
