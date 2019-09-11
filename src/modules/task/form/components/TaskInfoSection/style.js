// @flow
import { css } from 'react-emotion';
import { layout, presets, colors } from 'styles/common';

export const TaskSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 10px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export const MainFieldsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
  padding: 0 90px;
`;

export const BindingToggleButtonStyle = css`
  position: absolute;
  right: -50px;
  top: 5px;
  & > div > svg {
    color: ${colors.GRAY_VERY_LIGHT};
  }
`;

export const AutoDateWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const AutoDateOffsetWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const StatusWrapperStyle: string = css`
  position: relative;
`;

export const StatusColorStyle = ({
  color,
  backgroundColor,
}: {
  color: string,
  backgroundColor: string,
}) => {
  return css`
    & > div {
      & > div {
        & > div {
          background-color: ${colors[backgroundColor]};
          & > input {
            color: ${colors[color]};
          }
        }
      }
    }
  `;
};

export const CompletedAvatarStyle: string = css`
  position: absolute;
  right: -40px;
  top: 35px;
`;

export const ApprovalToggleStyle = (on: boolean) => css`
  margin-left: 8px;
  color: ${on ? colors.TEAL : colors.GRAY_DARK};
`;
