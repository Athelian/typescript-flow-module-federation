// @flow
import { css } from 'react-emotion';
import { presets, layout, colors } from 'styles/common';

export const MilestoneSectionStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export const FieldsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const StatusWrapperStyle: string = css`
  position: relative;
`;

export const CompletedAvatarStyle: string = css`
  position: absolute;
  right: -40px;
  top: 35px;
`;

export const StatusColorStyle = (completed: boolean) => {
  return css`
    & > div {
      & > div {
        & > div {
          background-color: ${completed ? colors.TEAL : colors.GRAY_SUPER_LIGHT};
          & > input {
            color: ${completed ? colors.WHITE : colors.GRAY};
          }
        }
      }
    }
  `;
};
