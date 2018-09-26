// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ObjectValue, ArrayValue } from 'react-values';
import Layout from 'components/Layout';
import BatchGridView from 'modules/batch/list/BatchGridView';
import GridColumn from 'components/GridColumn';
import { ShipmentBatchCard } from 'components/Cards';
import {
  SlideViewNavBar,
  EntityIcon,
  FilterInput,
  SortInput,
  SearchInput,
} from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import LoadingIcon from 'components/LoadingIcon';
import { batchListQuery } from 'modules/batch/list/query';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from 'modules/order/messages';
import { ItemWrapperStyle } from './style';

type Props = {
  onCancel: Function,
  onSelect: Function,
  intl: intlShape,
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
        },
        sort: { field: 'updatedAt', direction: 'DESCENDING' },
      }}
    >
      {({ value: filtersAndSort, set: onChange }) => (
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
                  <FilterInput
                    initialFilter={{}}
                    onChange={filters =>
                      onChange({
                        ...filtersAndSort,
                        filter: { ...filtersAndSort.filter, ...filters },
                      })
                    }
                    width={400}
                  >
                    {({ values, setFieldValue }) => (
                      <GridColumn>
                        <SearchInput
                          name="search"
                          value={values.query}
                          onClear={() => setFieldValue('query', '')}
                          onChange={newValue => setFieldValue('query', newValue)}
                        />
                      </GridColumn>
                    )}
                  </FilterInput>
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
                  <SaveButton disabled={selected.length === 0} onClick={() => onSelect(selected)} />
                </SlideViewNavBar>
              }
            >
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
                  const nextPage = getByPathWithDefault(1, 'batches.page', data) + 1;
                  const totalPage = getByPathWithDefault(1, 'batches.totalPage', data);
                  if (error) {
                    return error.message;
                  }

                  if (loading) return <LoadingIcon />;

                  return (
                    <BatchGridView
                      onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'batches')}
                      hasMore={nextPage <= totalPage}
                      isLoading={loading}
                      items={getByPathWithDefault([], 'batches.nodes', data)}
                      renderItem={item => (
                        <div key={item.id} className={ItemWrapperStyle}>
                          <ShipmentBatchCard
                            batch={item}
                            selectable
                            selected={selected.includes(item)}
                            onSelect={() => onSelectBatch({ selected, item, push, set })}
                          />
                        </div>
                      )}
                    />
                  );
                }}
              </Query>
            </Layout>
          )}
        </ArrayValue>
      )}
    </ObjectValue>
  );
}

export default injectIntl(SelectBatches);
