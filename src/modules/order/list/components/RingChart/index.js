// @flow
import React from 'react';
import { colors } from 'styles/common';
import { RingChartStyle } from './style';

type Props = {
  totalValue: number,
  values: Array<{
    value: number,
    color: string,
  }>,
  cascadeTotalValue?: boolean,
  showRedMargin?: boolean,
};

const RingChart = ({
  totalValue,
  values,
  cascadeTotalValue = false,
  showRedMargin = false,
}: Props) => {
  const originalRadius = 15.91549430918954;
  return (
    <svg className={RingChartStyle} width="100%" height="100%" viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="15.91549430918954" fill="#fff" />
      <circle
        cx="21"
        cy="21"
        r={`${originalRadius}`}
        fill="transparent"
        stroke={colors.GRAY_LIGHT}
        strokeWidth="3"
      />
      {showRedMargin &&
        values.length > 0 &&
        values[0].value > totalValue && (
          <circle
            cx="21"
            cy="21"
            r={`${originalRadius}`}
            fill="transparent"
            stroke={colors.ORANGE}
            strokeWidth="3"
            strokeDasharray={`${(1 - totalValue / values[0].value) *
              (originalRadius * 2 * Math.PI)} ${originalRadius * 2 * Math.PI -
              (1 - totalValue / values[0].value) * (originalRadius * 2 * Math.PI)}`}
            strokeDashoffset="25"
            style={{ transform: 'scaleX(-1) translateX(-42px)' }}
          />
        )}
      {totalValue > 0 &&
        values.map(({ value, color }, index) => {
          const radius = originalRadius - 3 * (index + 1);
          const percentageRatio = radius * 2 * Math.PI;

          const determinedTotalValue =
            cascadeTotalValue && index > 0 && values[index - 1].value > totalValue
              ? values[index - 1].value
              : totalValue;
          const dashValue = value > 0 ? (value / determinedTotalValue) * percentageRatio : 0;
          const dashSpace = percentageRatio - dashValue;
          const dashOffset = percentageRatio / 4;

          return (
            <circle
              key={radius}
              cx="21"
              cy="21"
              r={`${radius}`}
              fill="transparent"
              stroke={colors[color]}
              strokeWidth="3"
              strokeDasharray={`${dashValue} ${dashSpace}`}
              strokeDashoffset={`${dashOffset}`}
            />
          );
        })}
    </svg>
  );
};

RingChart.defaultProps = {
  cascadeTotalValue: false,
  showRedMargin: false,
};

export default RingChart;
