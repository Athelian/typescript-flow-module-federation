// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes, layout } from 'styles/common';

export const WrapperStyle: string = css`
  ${layout.LAYOUT};
  height: 75px;
  min-width: 800px;
`;

export const MilestoneNameStyle = (isCompleted: boolean): string => css`
  height: 20px;
  width: 80%;
  max-width: 130px;
  line-height: 20px;
  ${presets.ELLIPSIS};
  text-overflow: clip;
  ${borderRadiuses.BUTTON};
  background-color: ${isCompleted ? colors.TEAL : colors.GRAY};
  border: 1px solid ${isCompleted ? colors.TEAL : colors.GRAY};
  color: ${colors.WHITE};
  text-align: center;
  ${fontSizes.SMALL};
  padding: 0 2px;
  & > svg {
    margin: 0 2px 0 0;
  }
`;

export const TimelinesStyle = (columns: number): string => css`
  display: grid;
  grid-template-columns: repeat(${columns}, minmax(100px, 1fr));
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: auto;
  ${fontSizes.SMALL};
`;

export const TimelineStyle: string = css`
  justify-items: right;
  display: grid;
  grid-gap: 2px;
`;

const findBorderRadiusByPosition = (isFirst: boolean, isLast: boolean) => {
  if (isFirst && isLast) return `border-radius: 20px`;
  if (isFirst) return `border-radius: 20px 0px 0px 20px`;
  if (isLast) return `border-radius: 0px 20px 20px 2px`;
  return '';
};

export const ProgressBarStyle = (isFirst: boolean, isLast: boolean): string => css`
  ${findBorderRadiusByPosition(isFirst, isLast)};
  background-color: ${colors.GRAY};
  width: 100%;
`;

export const BarStyle = ({
  percent,
  isFirst,
  isLast,
}: {
  percent: number,
  isFirst: boolean,
  isLast: boolean,
}): string => css`
  ${percent && findBorderRadiusByPosition(isFirst, isLast)};
  ${percent && `border: 1px solid ${percent ? colors.TEAL : colors.GRAY};`}
  background-color: ${percent ? colors.TEAL : colors.GRAY};
  height: 10px;
  width: ${percent}%;
  ${fontSizes.TINY};
`;
