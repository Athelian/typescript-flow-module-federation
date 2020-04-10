// @flow
import * as React from 'react';
import { FullValueTooltip } from 'components/Tooltip';
import {
  TimelineWarehouseNameWrapperStyle,
  TimelineWarehouseNameStyle,
  TimelineWarehouseNameBadgeStyle,
} from './style';

type OptionalProps = {
  vertical: boolean,
  containers: Array<Object>,
};

type Props = OptionalProps & {
  name: ?string,
};

const defaultProps = {
  vertical: false,
  containers: [],
};

const TimelineWarehouseName = ({ name, vertical, containers = [] }: Props) => {
  const filteredWarehouses = containers
    .filter(group => group.warehouse)
    .map(group => group.warehouse.id);
  const warehouses = [...new Set(filteredWarehouses)].slice(1);
  const haveContainer = containers && containers.length > 0;
  return (
    <div className={TimelineWarehouseNameWrapperStyle(vertical, haveContainer)}>
      <FullValueTooltip message={name}>
        <div className={TimelineWarehouseNameStyle(vertical)}>{name}</div>
      </FullValueTooltip>
      {warehouses.length > 0 && (
        <div className={TimelineWarehouseNameBadgeStyle(vertical)}>+{warehouses.length}</div>
      )}
    </div>
  );
};

TimelineWarehouseName.defaultProps = defaultProps;

export default TimelineWarehouseName;
