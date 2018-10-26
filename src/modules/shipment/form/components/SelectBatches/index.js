// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ObjectValue, ArrayValue } from 'react-values';
import Layout from 'components/Layout';
import BatchGridView from 'modules/batch/list/BatchGridView';
import { ShipmentBatchCard } from 'components/Cards';
import { SlideViewNavBar, EntityIcon, SortInput, SearchInput } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { batchListQuery } from 'modules/batch/list/query';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from 'modules/order/messages';

type Props = {
  onCancel: Function,
  onSelect: Function,
  intl: IntlShape,
};

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

function SelectBatches({ intl, onCancel, onSelect }: Props) {
  const fields = [
    { title: intl.formatMessage(messages.updatedAtSort), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAtSort), value: 'createdAt' },
  ];
  return (
    <ObjectValue
      defaultValue={{
        perPage: 20,
        page: 1,
        filter: {
          query: '',
          hasShipment: false,
        },
        sort: { field: 'updatedAt', direction: 'DESCENDING' },
      }}
    >
      {({ value: filtersAndSort, set: onChange }) => (
        <Query
          query={batchListQuery}
          variables={{
            page: 1,
            perPage: filtersAndSort.perPage,
            filter: filtersAndSort.filter,
            sort: { [filtersAndSort.sort.field]: filtersAndSort.sort.direction },
          }}
        >
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
                            fields.find(item => item.value === filtersAndSort.sort.field) ||
                            fields[0]
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
                          disabled={selected.length === 0}
                          onClick={() => onSelect(selected)}
                        />
                      </SlideViewNavBar>
                    }
                  >
                    <BatchGridView
                      items={getByPathWithDefault([], 'batches.nodes', data)}
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
                        />
                      )}
                    />
                  </Layout>
                )}
              </ArrayValue>
            );
          }}
        </Query>
      )}
    </ObjectValue>
  );
}

export default injectIntl(SelectBatches);
