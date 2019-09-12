// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, fontSizes } from 'styles/common';

export const TaskSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 70px;
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const BindingToggleButtonStyle = css`
  position: absolute;
  right: -60px;
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
  margin-left: 10px;
  color: ${on ? colors.TEAL : colors.GRAY_DARK};
  ${fontSizes.MAIN};
  font-weight: bold;
`;

export const IconStyle: string = css`
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: ${colors.GRAY_LIGHT};
`;
