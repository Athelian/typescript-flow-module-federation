// @flow
import { css } from 'react-emotion';
import { presets, transitions, colors, borderRadiuses, layout, fontSizes } from 'styles/common';

export const OrderFormWrapperStyle = css`
  width: 1060px;
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const SectionWrapperStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LastModifiedWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  align-items: center;
`;

export const LabelStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  letter-spacing: 2px;
`;

export const ValueStyle = css`
  ${presets.ELLIPSIS};
  color: ${colors.BLACK};
  font-weight: bold;
  ${fontSizes.MAIN};
`;

export const UserIconStyle = css`
  display: flex;
  ${layout.CENTER_CENTER};
  color: #fff;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.GRAY_LIGHT};
  img {
    object-fit: cover;
  }
`;

export const StatusStyle = (active: boolean) => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${active ? colors.TEAL : colors.GRAY};
  ${fontSizes.MAIN};
  font-weight: bold;
  align-items: center;
`;

export const ToggleButtonStyle = css`
  ${presets.BUTTON};
  font-size: 20px;
  &:hover {
    & > svg {
      opacity: 0.8;
    }
  }
  & > svg {
    ${transitions.MAIN};
  }
  & > .fa-toggle-off {
    color: ${colors.GRAY_DARK};
  }
  & > .fa-toggle-on {
    color: ${colors.TEAL};
  }
`;
