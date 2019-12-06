// @flow
import * as React from 'react';
import type { BatchPayload, OrderItemPayload, OrganizationPayload } from 'generated/graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import useUser from 'hooks/useUser';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import SlideView from 'components/SlideView';
import NewShipmentForm from 'modules/shipment/common/NewShipmentForm';
import LoadingIcon from 'components/LoadingIcon';
import { orderItemFormQuery } from './query';

type Props = {|
  getBatch: (batchId: string, item: Object) => BatchPayload,
  getOrderItem: (batchId: string, item: Object) => OrderItemPayload,
  getImporter: (batchId: string, item: Object) => ?OrganizationPayload,
  getExporter: (batchId: string, item: Object) => ?OrganizationPayload,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const BatchMoveToNewShipmentActionImpl = ({
  onDone,
  getImporter,
  getExporter,
  getBatch,
  getOrderItem,
  entity,
  item,
}: ImplProps) => {
  const { isExporter, isImporter, isForwarder, organization } = useUser();
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [queryOrderItem, { loading, data, called }] = useLazyQuery(orderItemFormQuery);
  const batch = getBatch(entity.id, item);
  const orderItem = { ...getOrderItem(entity.id, item), ...(data?.orderItem ?? {}) };
  const newBatches = [{ ...batch, orderItem }];
  const importer = { ...getImporter(entity.id, item), types: ['Importer'] };
  const exporter = { ...getExporter(entity.id, item), types: ['Exporter'] };

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
        <NewShipmentForm
          initDataForSlideView={{
            importer: isImporter() ? importer : null,
            forwarders: isForwarder() ? [organization] : [],
            exporter: isExporter() ? exporter : null,
            batches: newBatches.map(currentBatch => ({
              ...currentBatch,
              container: null,
              shipment: null,
            })),
            containers: [],
          }}
          onSuccessCallback={close}
          onCancel={close}
        />
      )}
    </SlideView>
  );
};

const BatchMoveToNewShipmentAction = (props: Props) => (actions: ActionComponentProps) => (
  <BatchMoveToNewShipmentActionImpl {...props} {...actions} />
);

export default BatchMoveToNewShipmentAction;
