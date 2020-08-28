// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { useLazyQuery } from '@apollo/react-hooks';
import type { BatchPayload, OrderItemPayload, OrganizationPayload } from 'generated/graphql';
import loadMore from 'utils/loadMore';
import useFilterSort from 'hooks/useFilterSort';
import useUser from 'hooks/useUser';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import {
  EntityIcon,
  Filter,
  ShipmentFilterConfig,
  ShipmentSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import SlideView from 'components/SlideView';
import NewContainerForm from 'modules/shipment/common/NewContainerForm';
import ShipmentGridView from 'modules/shipment/list/ShipmentGridView';
import { ShipmentCard } from 'components/Cards';
import { SHIPMENT_ADD_BATCH } from 'modules/permission/constants/shipment';
import { BATCH_UPDATE } from 'modules/permission/constants/batch';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import LoadingIcon from 'components/LoadingIcon';
import ValidationCardOverlay from 'components/ValidationCardOverlay';
import { shipmentListQuery } from './query';
import { orderItemFormQuery } from '../BatchMoveToNewShipmentAction/query';

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

function ShipmentRenderer({
  shipment,
  selected,
  setSelected,
  exporterId,
  importerId,
}: {|
  shipment: Object,
  selected: ?Object,
  setSelected: (?Object) => void,
  importerId: ?string,
  exporterId: ?string,
|}) {
  const hasPermissions = useEntityHasPermissions(shipment);
  const isDifferentImporter = importerId !== shipment.importer?.id;
  const isDifferentExporter = exporterId !== shipment.exporter?.id && shipment.exporter?.id;
  const noPermission = !hasPermissions([BATCH_UPDATE, SHIPMENT_ADD_BATCH]);

  const msg = () => {
    if (noPermission)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.noPermission"
          defaultMessage="No permission"
        />
      );

    if (isDifferentImporter)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.isDifferentImporter"
          defaultMessage="Different importer"
        />
      );

    if (isDifferentExporter)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.isDifferentExporter"
          defaultMessage="Different exporter"
        />
      );

    return null;
  };

  return (
    <ValidationCardOverlay invalidMessage={msg()}>
      <ShipmentCard
        navigable={false}
        shipment={shipment}
        selectable={shipment.id === selected?.id}
        selected={shipment.id === selected?.id}
        onClick={() => {
          setSelected(shipment.id === selected?.id ? null : shipment);
        }}
      />
    </ValidationCardOverlay>
  );
}

const BatchMoveToNewContainerOnExsitShipmentActionImpl = ({
  onDone,
  getImporter,
  getExporter,
  getBatch,
  getOrderItem,
  entity,
  item,
}: ImplProps) => {
  const { user, isExporter } = useUser();
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [selected, setSelected] = React.useState(null);
  const [isShow, setIsShow] = React.useState(false);
  const [queryOrderItem, itemResult] = useLazyQuery(orderItemFormQuery);
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' },
    'shipment_cards'
  );
  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };
  const batch = getBatch(entity.id, item);
  const orderItem = { ...getOrderItem(entity.id, item), ...(itemResult?.data?.orderItem ?? {}) };
  const newBatches = [{ ...batch, orderItem }];
  const importer: Object = { ...getImporter(entity.id, item), types: ['Importer'] };
  const exporter: Object = { ...getExporter(entity.id, item), types: ['Exporter'] };

  React.useEffect(() => {
    if (isOpen && isShow && !itemResult?.called && orderItem?.id) {
      queryOrderItem({
        variables: { id: orderItem?.id },
      });
    }
  }, [isOpen, queryOrderItem, orderItem, isShow, itemResult.called, itemResult]);

  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
      {isShow ? (
        (() => {
          if (itemResult.loading)
            return (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="CARDS" />
                  <Filter
                    config={ShipmentFilterConfig}
                    filterBy={filterBy}
                    onChange={setFilterBy}
                  />
                  <Search query={query} onChange={setQuery} />
                  <Sort config={ShipmentSortConfig} sortBy={sortBy} onChange={setSortBy} />
                  <CancelButton onClick={close} />
                  <SaveButton
                    label={
                      <FormattedMessage id="components.button.continue" defaultMessage="Continue" />
                    }
                    disabled={!selected}
                    onClick={() => setIsShow(true)}
                  />
                </SlideViewNavBar>
                <Content>
                  <LoadingIcon />
                </Content>
              </SlideViewLayout>
            );

          return (
            <NewContainerForm
              container={{
                importer,
                exporter: isExporter() ? exporter : null,
                batches: newBatches.map(currentBatch => ({
                  ...currentBatch,
                  shipment: selected,
                })),
                shipment: selected,
              }}
              onSuccessCallback={close}
              shipmentId={selected?.id ?? ''}
              onCancel={close}
              user={user}
            />
          );
        })()
      ) : (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="SHIPMENT" color="SHIPMENT" subIcon="CARDS" />
            <Filter config={ShipmentFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
            <Search query={query} onChange={setQuery} />
            <Sort config={ShipmentSortConfig} sortBy={sortBy} onChange={setSortBy} />
            <CancelButton onClick={close} />
            <SaveButton
              label={<FormattedMessage id="components.button.continue" defaultMessage="Continue" />}
              disabled={!selected}
              onClick={() => setIsShow(true)}
            />
          </SlideViewNavBar>
          <Content>
            <Query query={shipmentListQuery} variables={queryVariables} fetchPolicy="network-only">
              {({ loading, data, fetchMore, error }) => {
                if (error) {
                  return error.message;
                }

                const nextPage = (data?.shipments?.page ?? 0) + 1;
                const totalPage = data?.shipments?.totalPage ?? 1;
                const hasMore = nextPage <= totalPage;

                return (
                  <>
                    <ShipmentGridView
                      items={data?.shipments?.nodes ?? []}
                      onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'shipments')}
                      hasMore={hasMore}
                      isLoading={loading}
                      renderItem={shipment => (
                        <ShipmentRenderer
                          key={shipment?.id}
                          selected={selected}
                          setSelected={setSelected}
                          shipment={shipment}
                          exporterId={exporter?.id}
                          importerId={importer?.id}
                        />
                      )}
                    />
                  </>
                );
              }}
            </Query>
          </Content>
        </SlideViewLayout>
      )}
    </SlideView>
  );
};

const BatchMoveToNewContainerOnExsitShipmentAction = (props: Props) => (
  actions: ActionComponentProps
) => <BatchMoveToNewContainerOnExsitShipmentActionImpl {...props} {...actions} />;

export default BatchMoveToNewContainerOnExsitShipmentAction;
