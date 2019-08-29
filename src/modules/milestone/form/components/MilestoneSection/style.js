// @flow
import { css } from 'react-emotion';
import { presets, layout } from 'styles/common';

export const CommonFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

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

export const DescriptionLabelWrapperStyle: string = css`
  height: 90px;
`;

export const StatusWrapperStyle: string = css`
  position: relative;
`;

export const CompletedAvatarStyle: string = css`
  position: absolute;
  right: -40px;
  top: 0;
`;
