// @flow
import * as React from 'react';
import SelectProjectAndMilestone from 'providers/SelectProjectAndMilestone';
import SelectOrderItems from 'providers/SelectOrderItems';
import { SelectOrders, SelectShipments, SelectProducts } from './components';

type Props = {
  type: string,
  onCancel: Function,
  onSelect: Function,
  isLoading?: boolean,
};

const ParentSelectList = ({ type, ...rest }: Props) => {
  switch (type) {
    case 'Order':
      return <SelectOrders {...rest} />;
    case 'OrderItem':
      return (
        <SelectOrderItems
          {...rest}
          saveOnSelect
          singleSelection
          isSubContent
          disableIncrement
          hideForbidden
        />
      );
    case 'Shipment':
      return <SelectShipments {...rest} />;
    case 'Milestone':
      return <SelectProjectAndMilestone {...rest} isSubContent hideForbidden saveOnSelect />;
    case 'ProductProvider':
      return <SelectProducts {...rest} />;
    default:
  }

  return null;
};

export default ParentSelectList;
