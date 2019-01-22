// @flow
import * as React from 'react';
import { isEnableBetaFeature } from 'utils/env';
import {
  TimelineWarehouseNameWrapperStyle,
  TimelineWarehouseNameStyle,
  TimelineWarehouseNameBadgeStyle,
} from './style';

type OptionalProps = {
  vertical: boolean,
  containerGroups: Array<Object>,
};

type Props = OptionalProps & {
  name: ?string,
};

const defaultProps = {
  vertical: false,
  containerGroups: [],
};

const TimelineWarehouseName = ({ name, vertical, containerGroups }: Props) => {
  const warehouses = (containerGroups || []).slice(1).filter(group => group.warehouse);
  return (
    <div className={TimelineWarehouseNameWrapperStyle(vertical)}>
      <div className={TimelineWarehouseNameStyle(vertical)}>{name}</div>
      {isEnableBetaFeature && warehouses.length > 0 && (
        <div className={TimelineWarehouseNameBadgeStyle(vertical)}>+{warehouses.length}</div>
      )}
    </div>
  );
};

TimelineWarehouseName.defaultProps = defaultProps;

export default TimelineWarehouseName;
