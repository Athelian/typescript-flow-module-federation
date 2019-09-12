// @flow
import { css } from 'react-emotion';
import { presets, colors } from 'styles/common';

export const EntitySectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const EntitySectionStyle: string = css`
  width: 880px;
  padding: 30px 10px;
`;
