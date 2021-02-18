// @flow
import * as React from 'react';
import SelectProjectAndMilestone from 'providers/SelectProjectAndMilestone';
import SelectOrderItems from 'providers/SelectOrderItems';
import { SelectOrders, SelectShipments, SelectEndProducts } from './components';

type Props = {
  type: string,
  onCancel: Function,
  onSelect: Function,
};

const ParentSelectList = ({ type, ...rest }: Props) => {
  switch (type) {
    case 'Order':
      return <SelectOrders {...rest} />;
    case 'Shipment':
      return <SelectShipments {...rest} />;
    case 'ProductProvider':
      return <SelectEndProducts {...rest} />;
    case 'Milestone':
      return <SelectProjectAndMilestone {...rest} isSubContent hideForbidden />;
    case 'OrderItem':
      return (
        <SelectOrderItems {...rest} singleSelection isSubContent disableIncrement hideForbidden />
      );
    default:
  }

  return null;
};

export default ParentSelectList;
