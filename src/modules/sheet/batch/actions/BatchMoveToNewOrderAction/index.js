// @flow
import * as React from 'react';
import type {
  OrderItemPayload,
  BatchPayload,
  ContainerPayload,
  ShipmentPayload,
  OrganizationPayload,
} from 'generated/graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import useUser from 'hooks/useUser';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import NewOrderForm from 'modules/order/common/NewOrderForm';
import LoadingIcon from 'components/LoadingIcon';
import SlideView from 'components/SlideView';
import { generateItemForMovedBatch } from 'utils/item';
import { orderItemFormQuery } from './query';

type Props = {|
  getBatch: (batchId: string, item: Object) => BatchPayload,
  getOrderItem: (batchId: string, item: Object) => OrderItemPayload,
  getContainer: (batchId: string, item: Object) => ?ContainerPayload,
  getShipment: (batchId: string, item: Object) => ?ShipmentPayload,
  getExporter: (batchId: string, item: Object) => OrganizationPayload,
|};

function BatchMoveToNewOrderActionImpl({
  entity,
  item,
  onDone,
  getBatch,
  getContainer,
  getShipment,
  getOrderItem,
  getExporter,
}: {|
  ...ActionComponentProps,
  ...Props,
|}) {
  const { isImporter, organization } = useUser();
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [queryOrderItem, { loading, data, called }] = useLazyQuery(orderItemFormQuery);
  const batch = getBatch(entity.id, item);
  const orderItem = getOrderItem(entity.id, item);
  const exporter = { ...getExporter(entity.id, item), types: ['Exporter'] };
  const newOrderItems = [];
  const { id: itemId, ...newOrderItem } = orderItem;
  const newContainers = [];
  const newShipments = [];
  const container = getContainer(entity.id, item);
  const shipment = getShipment(entity.id, item);
  if (container) {
    newContainers.push(container);
  }
  if (shipment) {
    newShipments.push(shipment);
  }

  const mergedOrderItem = {
    ...newOrderItem,
    ...(data?.orderItem ?? {}),
    order: {
      importer: isImporter() ? organization : {},
      exporter,
    },
  };

  newOrderItems.push(generateItemForMovedBatch(mergedOrderItem, batch));

  React.useEffect(() => {
    if (isOpen && !called && orderItem?.id) {
      queryOrderItem({
        variables: { id: orderItem?.id },
      });
    }
  }, [isOpen, called, queryOrderItem, orderItem]);

  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
      {loading || !called ? (
        <LoadingIcon />
      ) : (
        <NewOrderForm
          originalDataForSlideView={{
            orderItems: newOrderItems.map(currentOrderItem => ({
              id: currentOrderItem.id,
              isNew: true,
              batches: currentOrderItem.batches.map(currentBatch => ({
                ...currentBatch,
                isNew: true,
                quantity: 0,
              })),
            })),
          }}
          initDataForSlideView={{
            importer: isImporter() ? organization : {},
            exporter,
            orderItems: newOrderItems,
            containers: newContainers,
            shipments: newShipments,
          }}
          onCancel={close}
          onSuccessCallback={close}
        />
      )}
    </SlideView>
  );
}

export default function BatchMoveToNewOrderAction(props: Props) {
  return (actions: ActionComponentProps) => (
    <BatchMoveToNewOrderActionImpl {...props} {...actions} />
  );
}
