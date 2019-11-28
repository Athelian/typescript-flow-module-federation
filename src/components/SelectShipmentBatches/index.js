// @flow
import * as React from 'react';
import { removeTypename } from 'utils/data';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import Selector from 'components/Selector';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { ShipmentBatchCard } from 'components/Cards';
import {
  EntityIcon,
  Filter,
  BatchFilterConfig,
  BatchSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { BATCH_TASK_LIST } from 'modules/permission/constants/batch';
import BatchGridView from 'modules/batch/list/BatchGridView';
import { selectBatchListQuery } from './query';

type Props = {
  onCancel: Function,
  onSelect: Function,
  selectedBatches: Array<Object>,
  filter: Object,
};

const SelectShipmentBatches = ({ onCancel, onSelect, selectedBatches, filter }: Props) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false, hasShipment: false, ...filter },
    { updatedAt: 'DESCENDING' }
  );

  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const viewPrice = hasPermission(ORDER_ITEMS_GET_PRICE);
  const viewTasks = hasPermission(BATCH_TASK_LIST);

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    selectBatchListQuery,
    {
      variables: {
        filterBy: { query, excludeIds: selectedBatches.map(batch => batch.id), ...filterBy },
        sortBy,
        page: 1,
        perPage: 20,
      },
      fetchPolicy: 'network-only',
    },
    'batches'
  );

  return (
    <Selector.Many selected={[]}>
      {({ value, dirty, getItemProps }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="BATCH" color="BATCH" />

            <Filter
              config={BatchFilterConfig}
              filterBy={filterBy}
              onChange={setFilterBy}
              staticFilters={['archived', 'hasShipment', ...Object.keys(filter)]}
            />
            <Search query={query} onChange={setQuery} />
            <Sort config={BatchSortConfig} sortBy={sortBy} onChange={setSortBy} />

            <CancelButton onClick={onCancel} />
            <SaveButton
              data-testid="saveButtonOnSelectContainerBatches"
              disabled={!dirty}
              onClick={() => {
                onSelect(removeTypename(value));
              }}
            />
          </SlideViewNavBar>

          <Content>
            <BatchGridView
              items={nodes}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loading}
              renderItem={item => (
                <ShipmentBatchCard
                  key={item.id}
                  batch={item}
                  viewable={{
                    price: viewPrice,
                    tasks: viewTasks,
                  }}
                  {...getItemProps(item)}
                />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Many>
  );
};

export default SelectShipmentBatches;
