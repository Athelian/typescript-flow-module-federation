// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import { useEntityHasPermissions } from 'components/Context/Permissions';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import FilterToolBar from 'components/common/FilterToolBar';
import messages from 'modules/order/messages';
import OrderGridView from 'modules/order/list/OrderGridView';
import { OrderCard } from 'components/Cards';
import { orderListQuery } from 'modules/order/list/query';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { OverlayStyle } from './style';

type Props = {
  intl: IntlShape,
};

function OrderRenderer({
  order,
  selected,
  setSelected,
}: {
  order: Object,
  selected: ?string,
  setSelected: (?string) => void,
}) {
  const { state } = React.useContext(RelationMapContext);
  const { orderIds, importerIds, exporterIds } = state.moveActions;
  const hasPermissions = useEntityHasPermissions(order);
  const isSameOrderParent = orderIds.length === 1 && orderIds.includes(order.id);
  const isDifferentImporter = !importerIds.includes(order?.importer?.id);
  const isDifferentExporter = !exporterIds.includes(order?.exporter?.id);
  const noPermission = !hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
  const isInvalid = isSameOrderParent || isDifferentImporter || isDifferentExporter || noPermission;
  const msg = () => {
    if (noPermission)
      return (
        <FormattedMessage
          id="modules.RelationMap.move.noPermission"
          defaultMessage="No permission"
        />
      );

    if (isSameOrderParent)
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
  return (
    <>
      {isInvalid && (
        <div
          style={{
            width: 195,
            height: 303,
            position: 'relative',
            backgroundColor: 'rgba(239, 72, 72, 0.25)',
          }}
        >
          {msg()}
        </div>
      )}
      <OrderCard
        order={order}
        selectable={order.id === selected}
        selected={order.id === selected}
        onClick={() => {
          setSelected(order.id === selected ? null : order.id);
        }}
      />
    </>
  );
}

function SelectOrderToMove({ intl }: Props) {
  const { dispatch, state } = React.useContext(RelationMapContext);
  const [selected, setSelected] = React.useState(null);
  const { isProcessing, isOpen, type } = state.moveActions;
  React.useEffect(() => {
    return () => {
      if (isOpen) setSelected(null);
    };
  }, [isOpen]);
  const isMoveToOrder = type === 'existOrder';
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
    'filterOrderOnMoveNRM'
  );
  if (!isOpen || !isMoveToOrder) return null;
  return (
    <SlideView
      isOpen={isOpen && isMoveToOrder}
      onRequestClose={onCancel}
      targetId="shouldNotUseThisWay"
    >
      {isOpen && isMoveToOrder && (
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

export default injectIntl(SelectOrderToMove);
