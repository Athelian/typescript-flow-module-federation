// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { SaveButton, CancelButton } from 'components/Buttons';
import type { UserPayload } from 'generated/graphql';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import {
  EntityIcon,
  Filter,
  ContainerFilterConfig,
  ContainerSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { ContainerCard } from 'components/Cards';
import { BATCH_UPDATE } from 'modules/permission/constants/batch';
import { CONTAINER_BATCHES_ADD } from 'modules/permission/constants/container';
import Selector from 'components/Selector';
import useUser from 'hooks/useUser';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ValidationCardOverlay from 'components/ValidationCardOverlay';
import { OverlayStyle } from './style';
import { containerListQuery } from './query';
import { batchMoveToExistingContainerActionMutation } from './mutation';

type Props = {|
  getContainerId: (batchId: string, item: Object) => string,
  getImporterId: (batchId: string, item: Object) => string,
  getExporterId: (batchId: string, item: Object) => string,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

type ValidatedOrderCardProps = {|
  container: Object,
  user: UserPayload,
  containerId: string,
  importerId: string,
  exporterId: string,
  getItemProps: Function,
|};

const ValidatedContainerCard = ({
  container,
  user,
  containerId,
  importerId,
  exporterId,
  getItemProps,
}: ValidatedOrderCardProps) => {
  const itemProps = getItemProps(container);

  const hasPermissions = useEntityHasPermissions(container);
  const isSameParent = container?.id === containerId;
  const isDifferentImporter = importerId && container?.shipment?.importer?.id !== importerId;
  const hasMainExporter = !!container?.shipment?.exporter;
  const isDifferentExporter = hasMainExporter && container?.shipment?.exporter?.id !== exporterId;
  const noPermission = !hasPermissions([BATCH_UPDATE, CONTAINER_BATCHES_ADD]);

  let invalidMessage = null;

  if (noPermission) {
    invalidMessage = (
      <FormattedMessage id="modules.RelationMap.move.noPermission" defaultMessage="No permission" />
    );
  } else if (isSameParent) {
    invalidMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.sameParentContainer"
        defaultMessage="Same parent container"
      />
    );
  } else if (isDifferentImporter) {
    invalidMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.isDifferentImporter"
        defaultMessage="Different importer"
      />
    );
  } else if (isDifferentExporter) {
    invalidMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.isDifferentExporter"
        defaultMessage="Different exporter"
      />
    );
  }

  return (
    <ValidationCardOverlay invalidMessage={invalidMessage}>
      <ContainerCard container={container} user={user} {...itemProps} />
    </ValidationCardOverlay>
  );
};

const BatchMoveToExistingContainerActionImpl = ({
  entity,
  item,
  onDone,
  getContainerId,
  getImporterId,
  getExporterId,
}: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const { user } = useUser();
  const [batchUpdate, { loading: isProcessing, called }] = useMutation(
    batchMoveToExistingContainerActionMutation
  );

  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    {
      archived: false,
      query: '',
    },
    { updatedAt: 'DESCENDING' }
  );

  const { nodes: containers, loading, hasMore, loadMore } = useQueryList(
    containerListQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'containers'
  );

  const containerId = getContainerId(entity.id, item);
  const importerId = getImporterId(entity.id, item);
  const exporterId = getExporterId(entity.id, item);

  const onMove = (selectedContainer: Object) => {
    executeActionMutation(
      batchUpdate,
      {
        id: entity?.id,
        input: {
          containerId: selectedContainer?.id,
          shipmentId: selectedContainer?.shipment?.id,
        },
      },
      close
    );
  };

  return (
    <SlideView isOpen={isOpen} onRequestClose={close}>
      <Selector.Single selected={null}>
        {({ value: selectedContainer, dirty, getItemProps }) => (
          <SlideViewLayout>
            <SlideViewNavBar>
              <EntityIcon icon="CONTAINER" color="CONTAINER" subIcon="CARDS" />

              <Filter config={ContainerFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
              <Search query={query} onChange={setQuery} />
              <Sort config={ContainerSortConfig} sortBy={sortBy} onChange={setSortBy} />

              <CancelButton onClick={close} />
              <SaveButton
                disabled={!dirty || isProcessing || called}
                isLoading={isProcessing || called}
                onClick={() => onMove(selectedContainer)}
              />
            </SlideViewNavBar>

            <Content>
              {(isProcessing || called) && <div className={OverlayStyle} />}

              <GridView
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loading}
                itemWidth="195px"
                isEmpty={(containers ?? []).length === 0}
                emptyMessage={
                  <FormattedMessage
                    id="modules.Containers.noContainersFound"
                    defaultMessage="No Containers found"
                  />
                }
              >
                {containers.map(container => (
                  <ValidatedContainerCard
                    key={container.id}
                    container={container}
                    user={user}
                    containerId={containerId}
                    importerId={importerId}
                    exporterId={exporterId}
                    getItemProps={getItemProps}
                  />
                ))}
              </GridView>
            </Content>
          </SlideViewLayout>
        )}
      </Selector.Single>
    </SlideView>
  );
};

const BatchMoveToExistingContainerAction = (actions: Props) => (props: ActionComponentProps) => (
  <BatchMoveToExistingContainerActionImpl {...props} {...actions} />
);

export default BatchMoveToExistingContainerAction;
