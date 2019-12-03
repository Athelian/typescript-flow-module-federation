// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import useFilterSort from 'hooks/useFilterSort';
import loadMore from 'utils/loadMore';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds } from 'modules/relationMapV2/helpers';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import {
  EntityIcon,
  Filter,
  OrderFilterConfig,
  OrderSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import SlideView from 'components/SlideView';
import OrderGridView from 'modules/order/list/OrderGridView';
import { OrderCard } from 'components/Cards';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { BATCH } from 'modules/relationMapV2/constants';
import ValidationCardOverlay from 'components/ValidationCardOverlay';
import { OverlayStyle } from './style';
import { orderListQuery } from './query';
import { moveBatchesToOrder } from './mutation';

type Props = {|
  onSuccess: (orderIds: Array<string>, shipmentIds: Array<string>) => void,
|};

function OrderRenderer({
  order,
  selected,
  setSelected,
}: {
  order: Object,
  selected: ?Object,
  setSelected: (?Object) => void,
}) {
  const { state } = FocusedView.useContainer();
  const { orderIds, importerIds, exporterIds } = state.moveActions;
  const hasPermissions = useEntityHasPermissions(order);
  const isSameParent = orderIds.length === 1 && orderIds.includes(order.id);
  const isDifferentImporter = !importerIds.includes(order?.importer?.id);
  const isDifferentExporter = !exporterIds.includes(order?.exporter?.id);
  const noPermission = !hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);

  const msg = () => {
    if (noPermission)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.noPermission"
          defaultMessage="No permission"
        />
      );

    if (isSameParent)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.sameParentOrder"
          defaultMessage="Same parent order"
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

  const isSelected = order.id === selected?.id;

  return (
    <ValidationCardOverlay invalidMessage={msg()}>
      <OrderCard
        order={order}
        selectable={isSelected}
        selected={isSelected}
        onClick={() => {
          setSelected(isSelected ? null : order);
        }}
      />
    </ValidationCardOverlay>
  );
}

function SelectOrderToMove({ onSuccess }: Props) {
  const { dispatch, state } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const batchIds = targetedIds(state.targets, BATCH);
  const [selected, setSelected] = React.useState(null);
  const { isProcessing, isOpen, type, from } = state.moveActions;
  const isMoveToOrder = type === 'existOrder';
  const isMoveFromBatch = from === 'batch';
  React.useEffect(() => {
    return () => {
      if (isOpen) setSelected(null);
    };
  }, [isOpen]);
  const onCancel = () => {
    dispatch({
      type: 'MOVE_TO_ORDER_CLOSE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'MOVE_TO_ORDER_START',
      payload: {},
    });
    moveBatchesToOrder({
      batchIds,
      viewer: state.viewer,
      order: selected,
      entities: mapping.entities,
    })
      .then(result => onSuccess(result.orderIds, result.shipmentIds))
      .catch(onCancel);
  };

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false },
    { updatedAt: 'DESCENDING' }
  );
  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };
  return (
    <SlideView
      shouldConfirm={() => !!selected}
      isOpen={isOpen && isMoveToOrder && isMoveFromBatch}
      onRequestClose={onCancel}
    >
      {isOpen && isMoveToOrder && isMoveFromBatch && (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="ORDER" color="ORDER" subIcon="CARDS" />
            <Filter config={OrderFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
            <Search query={query} onChange={setQuery} />
            <Sort config={OrderSortConfig} sortBy={sortBy} onChange={setSortBy} />
            <CancelButton onClick={onCancel} />
            <SaveButton
              disabled={!selected || isProcessing}
              isLoading={isProcessing}
              onClick={onConfirm}
            />
          </SlideViewNavBar>
          <Content>
            <Query query={orderListQuery} variables={queryVariables} fetchPolicy="network-only">
              {({ loading, data, fetchMore, error }) => {
                if (error) {
                  return error.message;
                }

                const nextPage = (data?.orders?.page ?? 0) + 1;
                const totalPage = data?.orders?.totalPage ?? 1;
                const hasMore = nextPage <= totalPage;

                return (
                  <>
                    {isProcessing && <div className={OverlayStyle} />}
                    <OrderGridView
                      items={data?.orders?.nodes ?? []}
                      onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'orders')}
                      hasMore={hasMore}
                      isLoading={loading}
                      renderItem={order => (
                        <OrderRenderer
                          key={order?.id}
                          selected={selected}
                          setSelected={setSelected}
                          order={order}
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
}

export default SelectOrderToMove;
