// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import { ArrayValue } from 'react-values';
import { trackingError } from 'utils/trackingError';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { BATCH_TASK_LIST } from 'modules/permission/constants/batch';
import Layout from 'components/Layout';
import BatchGridView from 'modules/batch/list/BatchGridView';
import LoadingIcon from 'components/LoadingIcon';
import { ShipmentBatchCard } from 'components/Cards';
import { SlideViewNavBar, EntityIcon, SortInput, SearchInput } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { getByPathWithDefault } from 'utils/fp';
import { removeTypename } from 'utils/data';
import messages from 'modules/batch/messages';
import useFilter from 'hooks/useFilter';
import { selectBatchListQuery } from './query';

type Props = {
  onCancel: Function,
  onSelect: Function,
  intl: IntlShape,
  selectedBatches: Array<Object>,
};

const getInitFilter = () => ({
  perPage: 20,
  page: 1,
  filter: {
    query: '',
    hasShipment: false,
    archived: false,
  },
  sort: { field: 'updatedAt', direction: 'DESCENDING' },
});

function onSelectBatch({
  selected,
  item,
  onPush,
  onSet,
}: {
  selected: Array<Object>,
  item: Object,
  onPush: Function,
  onSet: Function,
}) {
  if (!selected.includes(item)) {
    onPush(item);
  } else {
    onSet(selected.filter((batchItem: Object) => batchItem.id !== item.id));
  }
}

function SelectContainerBatches({ intl, onCancel, onSelect, selectedBatches }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const viewPrice = hasPermission(ORDER_ITEMS_GET_PRICE);
  const viewTasks = hasPermission(BATCH_TASK_LIST);
  const ignoreBatches = selectedBatches.map(batch => batch.id);
  const fields = [
    { title: intl.formatMessage(messages.batchNo), value: 'no' },
    { title: intl.formatMessage(messages.PO), value: 'poNo' },
    {
      title: intl.formatMessage(messages.productName),
      value: 'product',
    },
    {
      title: intl.formatMessage(messages.deliveredAt),
      value: 'deliveredAt',
    },
    {
      title: intl.formatMessage(messages.expiredAt),
      value: 'expiredAt',
    },
    {
      title: intl.formatMessage(messages.producedAt),
      value: 'producedAt',
    },
    {
      title: intl.formatMessage(messages.updatedAt),
      value: 'updatedAt',
    },
    {
      title: intl.formatMessage(messages.createdAt),
      value: 'createdAt',
    },
  ];
  const { filterAndSort: filtersAndSort, queryVariables, onChangeFilter: onChange } = useFilter(
    getInitFilter(),
    'filterSelectContainerBatches'
  );

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
      {({ value: selected, push: onPush, set: onSet }) => (
        <Layout
          navBar={
            <SlideViewNavBar>
              <EntityIcon icon="BATCH" color="BATCH" />
              <SortInput
                sort={fields.find(item => item.value === filtersAndSort.sort.field) || fields[0]}
                ascending={filtersAndSort.sort.direction !== 'DESCENDING'}
                fields={fields}
                onChange={({ field: { value }, ascending }) =>
                  onChange({
                    ...filtersAndSort,
                    sort: {
                      field: value,
                      direction: ascending ? 'ASCENDING' : 'DESCENDING',
                    },
                  })
                }
              />
              <SearchInput
                value={filtersAndSort.filter.query}
                name="search"
                onClear={() =>
                  onChange({
                    ...filtersAndSort,
                    filter: { ...filtersAndSort.filter, query: '' },
                  })
                }
                onChange={newQuery =>
                  onChange({
                    ...filtersAndSort,
                    filter: { ...filtersAndSort.filter, query: newQuery },
                  })
                }
              />
              <CancelButton onClick={onCancel} />
              <SaveButton
                data-testid="saveButtonOnSelectContainerBatches"
                disabled={selected.length === 0}
                onClick={() => {
                  onSelect(removeTypename(selected));
                }}
              />
            </SlideViewNavBar>
          }
        >
          <BatchGridView
            items={batches.filter(item => !ignoreBatches.includes(item.id))}
            loader={null}
            onLoadMore={() => {
              setIsLoading(true);
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
                  setIsLoading(false);
                })
                .catch(err => {
                  trackingError(err);
                  toast.error(
                    intl.formatMessage({
                      id: 'global.apiErrorMessage',
                      defaultMessage: 'There was an error. Please try again later.',
                    })
                  );
                  setIsLoading(false);
                });
            }}
            hasMore={hasMore}
            isLoading={isLoading && batches.length === 0}
            renderItem={item => (
              <ShipmentBatchCard
                key={item.id}
                batch={item}
                selectable
                selected={selected.includes(item)}
                onSelect={() => onSelectBatch({ selected, item, onPush, onSet })}
                viewable={{
                  price: viewPrice,
                  tasks: viewTasks,
                }}
              />
            )}
          />
          {isLoading && batches.length > 0 && <LoadingIcon />}
        </Layout>
      )}
    </ArrayValue>
  );
}

export default injectIntl(SelectContainerBatches);
