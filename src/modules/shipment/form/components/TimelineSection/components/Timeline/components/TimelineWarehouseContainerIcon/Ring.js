// @flow
import React from 'react';
import { cx } from 'react-emotion';
import { TimelineRingWrapperStyle, TimelineBarStyle, TimelineFillStyle } from './style';

type OptionalProps = {
  className?: string,
};

type Props = OptionalProps & {
  percent: number,
  size: number,
  color: string,
};

const defaultProps = {
  className: '',
};
const Ring = (props: Props) => {
  const { percent, size, className, color } = props;
  return (
    <div className={cx(TimelineRingWrapperStyle(percent, size), className)}>
      <div className={TimelineBarStyle({ percent, size, color })} />
      <div className={TimelineFillStyle({ percent, size, color })} />
    </div>
  );
};
Ring.defaultProps = defaultProps;
export default Ring;
