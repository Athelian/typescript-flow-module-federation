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
import { Content, SlideViewLayout } from 'components/Layout';
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

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
  intl: IntlShape,
  selectedBatches: Array<Object>,
  filter: Object,
};

const getInitFilter = (filter: Object) => ({
  perPage: 20,
  page: 1,
  filter: {
    query: '',
    hasShipment: false,
    archived: false,
    ...filter,
  },
  sort: { field: 'updatedAt', direction: 'DESCENDING' },
});

function SelectShipmentBatches({
  intl,
  cacheKey,
  onCancel,
  onSelect,
  selectedBatches,
  filter,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const viewPrice = hasPermission(ORDER_ITEMS_GET_PRICE);
  const viewTasks = hasPermission(BATCH_TASK_LIST);
  const ignoreBatches = selectedBatches.map(batch => batch.id);
  const fields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.batchNo), value: 'no' },
    { title: intl.formatMessage(messages.poNo), value: 'poNo' },
    { title: intl.formatMessage(messages.productName), value: 'productName' },
    { title: intl.formatMessage(messages.productSerial), value: 'productSerial' },
    { title: intl.formatMessage(messages.deliveredAt), value: 'deliveredAt' },
    { title: intl.formatMessage(messages.expiredAt), value: 'expiredAt' },
    { title: intl.formatMessage(messages.producedAt), value: 'producedAt' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter(filter),
    cacheKey
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
      {({ value: selected, push, filter: arrayValueFilter }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="BATCH" color="BATCH" />
            <SortInput
              sort={fields.find(item => item.value === filterAndSort.sort.field) || fields[0]}
              ascending={filterAndSort.sort.direction !== 'DESCENDING'}
              fields={fields}
              onChange={({ field: { value }, ascending }) =>
                onChangeFilter({
                  ...filterAndSort,
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                })
              }
            />
            <SearchInput
              value={filterAndSort.filter.query}
              name="search"
              onClear={() =>
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, query: '' },
                })
              }
              onChange={newQuery =>
                onChangeFilter({
                  ...filterAndSort,
                  filter: { ...filterAndSort.filter, query: newQuery },
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

          <Content>
            {isLoading && batches.length > 0 && <LoadingIcon />}
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
              renderItem={item => {
                const isSelected = selected.map(({ id }) => id).includes(item.id);
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

const defaultProps = {
  cacheKey: 'SelectShipmentBatches',
};

SelectShipmentBatches.defaultProps = defaultProps;

export default injectIntl(SelectShipmentBatches);
