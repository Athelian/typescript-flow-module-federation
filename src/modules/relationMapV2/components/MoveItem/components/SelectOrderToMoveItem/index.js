// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds } from 'modules/relationMapV2/helpers';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import FilterToolBar from 'components/common/FilterToolBar';
import messages from 'modules/order/messages';
import OrderGridView from 'modules/order/list/OrderGridView';
import { OrderCard } from 'components/Cards';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import { ORDER_ITEM } from 'modules/relationMapV2/constants';
import { OverlayStyle } from './style';
import { orderListQuery } from './query';
import { moveOrderItemsToOrder } from './mutation';

type Props = {
  intl: IntlShape,
  onSuccess: (orderIds: Array<string>) => void,
};

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
  const noPermission = !hasPermissions([ORDER_ITEMS_UPDATE]);
  const isInvalid = isSameParent || isDifferentImporter || isDifferentExporter || noPermission;
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
    <div
      style={{
        width: 195,
        height: 303,
        position: 'relative',
      }}
    >
      {isInvalid && (
        <div
          style={{
            position: 'absolute',
            zIndex: 2,
            width: 195,
            height: 303,
            backgroundColor: 'rgba(239, 72, 72, 0.25)',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          {msg()}
        </div>
      )}
      <OrderCard
        order={order}
        selectable={isSelected}
        selected={isSelected}
        onClick={() => {
          setSelected(isSelected ? null : order);
        }}
      />
    </div>
  );
}

function SelectOrderToMoveItem({ intl, onSuccess }: Props) {
  const { dispatch, state } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const itemIds = targetedIds(state.targets, ORDER_ITEM);
  const [selected, setSelected] = React.useState(null);
  const { isProcessing, isOpen, from } = state.moveActions;
  const isMoveFromItem = from === 'item';
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
    moveOrderItemsToOrder({
      order: selected,
      itemIds,
      entities: mapping.entities,
    })
      .then(onSuccess)
      .catch(onCancel);
  };

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.poSort), value: 'poNo' },
    { title: intl.formatMessage(messages.piSort), value: 'piNo' },
    { title: intl.formatMessage(messages.date), value: 'issuedAt' },
    { title: intl.formatMessage(messages.exporterName), value: 'exporterName' },
    { title: intl.formatMessage(messages.currency), value: 'currency' },
    { title: intl.formatMessage(messages.incoterm), value: 'incoterm' },
    { title: intl.formatMessage(messages.deliveryPlace), value: 'deliveryPlace' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    {
      filter: {
        query: '',
        archived: false,
      },
      sort: {
        field: 'updatedAt',
        direction: 'DESCENDING',
      },
      perPage: 10,
      page: 1,
    },
    'filterOrderOnMoveNRMFromItem'
  );
  return (
    <SlideView
      shouldConfirm={() => !!selected}
      isOpen={isOpen && isMoveFromItem}
      onRequestClose={onCancel}
    >
      {isOpen && isMoveFromItem && (
        <SlideViewLayout>
          <SlideViewNavBar>
            <FilterToolBar
              icon="ORDER"
              sortFields={sortFields}
              filtersAndSort={filterAndSort}
              onChange={onChangeFilter}
              canArchive
              canSearch
            />
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

export default injectIntl(SelectOrderToMoveItem);
