// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import { ArrayValue } from 'react-values';
import { trackingError } from 'utils/trackingError';
import { getByPathWithDefault } from 'utils/fp';
import { removeTypename } from 'utils/data';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import useFilterSort from 'hooks/useFilterSort';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { BATCH_TASK_LIST } from 'modules/permission/constants/batch';
import BatchGridView from 'modules/batch/list/BatchGridView';
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
import { selectBatchListQuery } from './query';

type Props = {
  onCancel: Function,
  onSelect: Function,
  selectedBatches: Array<Object>,
  filter: Object,
};

function SelectShipmentBatches({ onCancel, onSelect, selectedBatches, filter }: Props) {
  const intl = useIntl();
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', archived: false, hasShipment: false, ...filter },
    { updatedAt: 'DESCENDING' }
  );

  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 };

  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const viewPrice = hasPermission(ORDER_ITEMS_GET_PRICE);
  const viewTasks = hasPermission(BATCH_TASK_LIST);
  const ignoreBatches = selectedBatches.map(batch => batch.id);

  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [batches, setBatches] = React.useState([]);
  const { loading, error, client, networkStatus } = useQuery(selectBatchListQuery, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: result => {
      setBatches(getByPathWithDefault([], 'batches.nodes', result));
      const nextPage = getByPathWithDefault(1, 'batches.page', result) + 1;
      const totalPage = getByPathWithDefault(1, 'batches.totalPage', result);
      setHasMore(nextPage <= totalPage);
      setPage(nextPage);
      setIsLoading(false);
    },
  });

  const refetching = networkStatus === 4;

  React.useEffect(() => {
    if (loading && !refetching) {
      setIsLoading(true);
    }
  }, [loading, refetching]);

  if (error) {
    return error.message;
  }

  return (
    <ArrayValue>
      {({ value: selected, push, filter: arrayValueFilter }) => (
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
              disabled={selected.length === 0}
              onClick={() => {
                onSelect(removeTypename(selected));
              }}
            />
          </SlideViewNavBar>

          <Content>
            <BatchGridView
              items={batches.filter(item => !ignoreBatches.includes(item.id))}
              onLoadMore={() => {
                client
                  .query({
                    query: selectBatchListQuery,
                    fetchPolicy: 'no-cache',
                    variables: {
                      ...queryVariables,
                      page,
                    },
                  })
                  .then(result => {
                    setBatches([
                      ...batches,
                      ...getByPathWithDefault([], 'data.batches.nodes', result),
                    ]);
                    const nextPage = getByPathWithDefault(1, 'data.batches.page', result) + 1;
                    const totalPage = getByPathWithDefault(1, 'data.batches.totalPage', result);
                    setHasMore(nextPage <= totalPage);
                    setPage(nextPage);
                  })
                  .catch(err => {
                    trackingError(err);
                    toast.error(
                      intl.formatMessage({
                        id: 'global.apiErrorMessage',
                        defaultMessage: 'There was an error. Please try again later.',
                      })
                    );
                  });
              }}
              hasMore={hasMore}
              isLoading={isLoading}
              renderItem={item => {
                const isSelected = selected.some(({ id }) => id === item.id);
                return (
                  <ShipmentBatchCard
                    key={item.id}
                    batch={item}
                    selectable
                    selected={isSelected}
                    onSelect={() => {
                      if (isSelected) {
                        arrayValueFilter(({ id }) => id !== item.id);
                      } else {
                        push(item);
                      }
                    }}
                    viewable={{
                      price: viewPrice,
                      tasks: viewTasks,
                    }}
                  />
                );
              }}
            />
          </Content>
        </SlideViewLayout>
      )}
    </ArrayValue>
  );
}

export default SelectShipmentBatches;
