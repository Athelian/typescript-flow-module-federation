// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, scrollbars } from 'styles/common';

export const ColumnsConfigSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const ColumnsConfigSectionBodyStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 10px;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  max-height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;
