// @flow
import * as React from 'react';
import { TimelineWarehouseNameWrapperStyle } from './style';

type OptionalProps = {
  vertical: boolean,
};

type Props = OptionalProps & {
  name: ?string,
};

const defaultProps = {
  vertical: false,
};

const TimelineWarehouseName = ({ name, vertical }: Props) => (
  <div className={TimelineWarehouseNameWrapperStyle(vertical)}>{name}</div>
);

TimelineWarehouseName.defaultProps = defaultProps;

export default TimelineWarehouseName;
