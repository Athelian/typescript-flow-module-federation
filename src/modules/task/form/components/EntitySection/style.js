// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const EntitySectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const EntitySectionStyle: string = css`
  width: 880px;
  padding: 30px 10px;
`;
