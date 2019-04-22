// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import { BATCH_TASK_LIST } from 'modules/permission/constants/batch';
import Layout from 'components/Layout';
import BatchGridView from 'modules/batch/list/BatchGridView';
import { ShipmentBatchCard } from 'components/Cards';
import { SlideViewNavBar, EntityIcon, SortInput, SearchInput } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { getByPathWithDefault } from 'utils/fp';
import { removeTypename } from 'utils/data';
import loadMore from 'utils/loadMore';
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
  },
  sort: { field: 'updatedAt', direction: 'DESCENDING' },
});
function onSelectBatch({
  selected,
  item,
  push,
  set,
}: {
  selected: Array<Object>,
  item: Object,
  push: Function,
  set: Function,
}) {
  if (!selected.includes(item)) {
    push(item);
  } else {
    set(selected.filter((batchItem: Object) => batchItem.id !== item.id));
  }
}

function SelectBatches({ intl, onCancel, onSelect, selectedBatches }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const removedBatches = selectedBatches.reduce(
    (removedBatch, batch) =>
      Object.assign(removedBatch, {
        [batch.id]: true,
      }),
    {}
  );
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
    'filterSelectBatches'
  );
  return (
    <Query query={selectBatchListQuery} variables={queryVariables} fetchPolicy="network-only">
      {({ loading, data, error, fetchMore }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'batches.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'batches.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <ArrayValue>
            {({ value: selected, push, set }) => (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <EntityIcon icon="BATCH" color="BATCH" />
                    <SortInput
                      sort={
                        fields.find(item => item.value === filtersAndSort.sort.field) || fields[0]
                      }
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
                      data-testid="saveButtonOnSelectBatches"
                      disabled={selected.length === 0}
                      onClick={() => {
                        onSelect(removeTypename(selected));
                      }}
                    />
                  </SlideViewNavBar>
                }
              >
                <BatchGridView
                  items={getByPathWithDefault([], 'batches.nodes', data).filter(
                    item => !removedBatches[item.id]
                  )}
                  onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'batches')}
                  hasMore={hasMore}
                  isLoading={loading}
                  renderItem={item => (
                    <ShipmentBatchCard
                      batch={item}
                      selectable
                      selected={selected.includes(item)}
                      onSelect={() => onSelectBatch({ selected, item, push, set })}
                      key={item.id}
                      read={{
                        price: hasPermission(ORDER_ITEMS_GET_PRICE),
                        tasks: hasPermission(BATCH_TASK_LIST),
                      }}
                    />
                  )}
                />
              </Layout>
            )}
          </ArrayValue>
        );
      }}
    </Query>
  );
}

export default injectIntl(SelectBatches);
