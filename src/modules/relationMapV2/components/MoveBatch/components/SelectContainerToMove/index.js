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
import messages from 'modules/container/messages';
import ContainerGridView from 'modules/container/list/ContainerGridView';
import { ContainerCard } from 'components/Cards';
import { BATCH_UPDATE } from 'modules/permission/constants/batch';
import { CONTAINER_BATCHES_ADD } from 'modules/permission/constants/container';
import { BATCH } from 'modules/relationMapV2/constants';
import { OverlayStyle } from './style';
import { containerListQuery } from './query';
import { moveBatchesToContainer } from './mutation';

type Props = {
  intl: IntlShape,
  onSuccess: (orderIds: Array<string>, shipmentIds: Array<string>) => void,
};

function ContainerRenderer({
  container,
  selected,
  setSelected,
}: {
  container: Object,
  selected: ?Object,
  setSelected: (?Object) => void,
}) {
  const { state } = FocusedView.useContainer();
  const { containerIds, importerIds, exporterIds } = state.moveActions;
  const isSameParent = containerIds.length === 1 && containerIds.includes(container.id);
  const hasPermissions = useEntityHasPermissions(container);
  const isDifferentImporter = !importerIds.includes(container?.shipment?.importer?.id);
  const isDifferentExporter =
    (exporterIds.length === 1 &&
      !exporterIds.includes(container?.shipment?.exporter?.id) &&
      container?.shipment?.exporter?.id) ||
    (exporterIds.length > 1 && container?.shipment?.exporter?.id);
  const noPermission = !hasPermissions([BATCH_UPDATE, CONTAINER_BATCHES_ADD]);
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
          id="modules.RelationMap.move.sameParentContainer"
          defaultMessage="Same parent container"
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
    <div
      style={{
        width: 195,
        height: 448,
        position: 'relative',
      }}
    >
      {isInvalid && (
        <div
          style={{
            position: 'absolute',
            zIndex: 2,
            width: 195,
            height: 448,
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
      <ContainerCard
        container={container}
        selectable={container.id === selected?.id}
        selected={container.id === selected?.id}
        onClick={() => {
          setSelected(container.id === selected?.id ? null : container);
        }}
      />
    </div>
  );
}

function SelectContainerToMove({ intl, onSuccess }: Props) {
  const { dispatch, state } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const batchIds = targetedIds(state.targets, BATCH);
  const [selected, setSelected] = React.useState(null);
  const { isProcessing, isOpen, type, orderIds, from } = state.moveActions;
  const isMoveFromBatch = from === 'batch';
  const isMoveToContainer = type === 'existContainer';
  React.useEffect(() => {
    return () => {
      if (isOpen) setSelected(null);
    };
  }, [isOpen]);
  const onCancel = () => {
    dispatch({
      type: 'MOVE_TO_CONTAINER_CLOSE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'MOVE_TO_CONTAINER_START',
      payload: {},
    });
    moveBatchesToContainer({
      batchIds,
      orderIds,
      viewer: state.viewer,
      container: selected,
      entities: mapping.entities,
    })
      .then(result => onSuccess(result.orderIds, result.shipmentIds))
      .catch(onCancel);
  };

  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.warehouseName), value: 'warehouseName' },
    {
      title: intl.formatMessage(messages.warehouseArrivalActualDate),
      value: 'warehouseArrivalActualDate',
    },
    {
      title: intl.formatMessage(messages.warehouseArrivalAgreedDate),
      value: 'warehouseArrivalAgreedDate',
    },
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
    'filterContainerOnMoveNRM'
  );
  return (
    <SlideView
      shouldConfirm={() => !!selected}
      isOpen={isOpen && isMoveToContainer && isMoveFromBatch}
      onRequestClose={onCancel}
    >
      {isOpen && isMoveToContainer && isMoveFromBatch && (
        <SlideViewLayout>
          <SlideViewNavBar>
            <FilterToolBar
              icon="CONTAINER"
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
            <Query query={containerListQuery} variables={queryVariables} fetchPolicy="network-only">
              {({ loading, data, fetchMore, error }) => {
                if (error) {
                  return error.message;
                }

                const nextPage = (data?.containers?.page ?? 0) + 1;
                const totalPage = data?.containers?.totalPage ?? 1;
                const hasMore = nextPage <= totalPage;

                return (
                  <>
                    {isProcessing && <div className={OverlayStyle} />}
                    <ContainerGridView
                      items={data?.containers?.nodes ?? []}
                      onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'containers')}
                      hasMore={hasMore}
                      isLoading={loading}
                      renderItem={container => (
                        <ContainerRenderer
                          key={container?.id}
                          selected={selected}
                          setSelected={setSelected}
                          container={container}
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

export default injectIntl(SelectContainerToMove);
