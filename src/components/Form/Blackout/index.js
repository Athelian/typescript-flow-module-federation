// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { BlackoutWrapperStyle } from './style';

type Props = {|
  width: string,
  height: string,
|};

const defaultProps = {
  width: '100%',
  height: '100%',
};

const Blackout = ({ width, height, ...rest }: Props) => (
  <div className={BlackoutWrapperStyle({ width, height })} {...rest}>
    <Icon icon="DISABLED" />
  </div>
);

Blackout.defaultProps = defaultProps;

export default Blackout;
