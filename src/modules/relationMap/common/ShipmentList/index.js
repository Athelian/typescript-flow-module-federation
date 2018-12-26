// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import Item from 'modules/relationMap/orderFocused/Item';
import { isEmpty, getByPathWithDefault } from 'utils/fp';

type Props = {
  shipment: Object,
  result: Array<Object>,
};
const ShipmentList = ({ shipment, result }: Props) => (
  <>
    {result &&
      result.map(newShipment => {
        if (isEmpty(newShipment)) {
          return null;
        }
        return (
          <BooleanValue defaultValue key={`new-${newShipment.id}`}>
            {({ value: isCollapsed, toggle }) => (
              <Item
                key={newShipment.id}
                onToggle={toggle}
                isCollapsed={isCollapsed}
                relation={{
                  type: isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT',
                  id: newShipment.id,
                  isNew: newShipment.actionType,
                }}
                itemData={{
                  data: newShipment,
                  relation: getByPathWithDefault({}, `${newShipment.id}.relation`, shipment),
                }}
                itemType="shipment"
              />
            )}
          </BooleanValue>
        );
      })}
    {Object.keys(shipment)
      .filter(shipmentId => {
        const hasShipmentResult =
          result &&
          result.length > 0 &&
          result.some(shipmentData => shipmentData.id === shipmentId);
        return !hasShipmentResult;
      })
      .map(shipmentId => {
        const currentShipment = shipment[shipmentId];
        return (
          <BooleanValue defaultValue key={shipmentId}>
            {({ value: isCollapsed, toggle }) => (
              <Item
                key={shipmentId}
                onToggle={toggle}
                isCollapsed={isCollapsed}
                relation={{
                  type: isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT',
                  id: shipmentId,
                }}
                itemData={currentShipment}
                itemType="shipment"
              />
            )}
          </BooleanValue>
        );
      })}
  </>
);

export default ShipmentList;
