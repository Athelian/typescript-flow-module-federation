// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets } from 'styles/common';

export const RMOrderCardWrapperStyle: string = css`
  position: relative;
  display: flex;
  width: 290px;
  height: 40px;
`;

export const InfoWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 135px;
`;

export const PONoWrapperStyle: string = css`
  width: 100%;
`;

export const ExporterWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  & > svg {
    margin: 0 5px 0 0;
    color: ${colors.GRAY_DARK};
  }
`;

export const ChartWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 135px;
  padding: 0 5px 0 0;
`;

export const TaskRingWrapperStyle: string = css`
  position: absolute;
  bottom: 1px;
  right: 1px;
`;
