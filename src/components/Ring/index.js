// @flow
import React from 'react';
import { cx } from 'react-emotion';
import { RingWrapperStyle, BarStyle, FillStyle } from './style';

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
    <div className={cx(RingWrapperStyle(percent, size), className)}>
      <div className={BarStyle({ percent, size, color })} />
      <div className={FillStyle({ percent, size, color })} />
    </div>
  );
};

Ring.defaultProps = defaultProps;

export default Ring;
