import React from 'react';
import { createObjectValue } from 'react-values';
import { OrderArchiveDialog } from 'modules/order/common/Dialog';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT } from 'modules/relationMap/orderFocused/relation';
import { OrderItemDeleteDialog, ShipmentDeleteDialog, BatchDeleteDialog } from './index';

export const ToggleDeleteDialog = createObjectValue({ isOpen: false, data: null, type: '' });

const DeleteDialog = () => (
  <ToggleDeleteDialog>
    {({ value: { isOpen, type, data }, set }) => {
      const onRequestClose = () => set('isOpen', false);
      return (
        <>
          <OrderArchiveDialog
            onRequestClose={onRequestClose}
            isOpen={isOpen && type === ORDER}
            order={data}
          />
          <OrderItemDeleteDialog
            onRequestClose={onRequestClose}
            isOpen={isOpen && type === ORDER_ITEM}
            orderItem={data}
          />
          <BatchDeleteDialog
            onRequestClose={onRequestClose}
            isOpen={isOpen && type === BATCH}
            batch={data}
          />
          <ShipmentDeleteDialog
            onRequestClose={onRequestClose}
            isOpen={isOpen && type === SHIPMENT}
            shipment={data}
          />
        </>
      );
    }}
  </ToggleDeleteDialog>
);

export default DeleteDialog;
