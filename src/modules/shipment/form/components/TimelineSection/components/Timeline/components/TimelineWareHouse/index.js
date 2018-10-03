// @flow
import * as React from 'react';
import { TimelineWareHouseNameWrapperStyle } from './style';

type OptionalProps = {
  vertical: boolean,
};

type Props = OptionalProps & {
  name: ?string,
};

const defaultProps = {
  vertical: false,
};

const TimelineWareHouse = ({ name, vertical }: Props) => (
  <div className={TimelineWareHouseNameWrapperStyle(vertical)}>{name}</div>
);

TimelineWareHouse.defaultProps = defaultProps;

export default TimelineWareHouse;
