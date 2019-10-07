// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ArrayValue } from 'react-values';
import { Query } from 'react-apollo';
import {
  EntityIcon,
  Filter,
  SearchInput,
  Sort,
  WarehouseSortConfig,
  WarehouseFilterConfig,
} from 'components/NavBar';
import { CancelButton, SaveButton } from 'components/Buttons';
import { Content, SlideViewNavBar } from 'components/Layout';
import BaseCard from 'components/Cards/BaseCard';
import { WarehouseCard } from 'components/Cards';
import SlideView from 'components/SlideView';
import GridView from 'components/GridView';
import { Display } from 'components/Form';
import { isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import messages from '../../messages';
import Ids from '../Ids';
import { warehousesQuery, warehousesByIDsQuery } from './query';
import { CardStyle } from './style';

type Props = {
  value: Array<string>,
  readonly: boolean,
  onChange: (Array<string>) => void,
};

type SelectorProps = {
  open: boolean,
  onClose: () => void,
  selected: Array<string>,
  setSelected: (Array<string>) => void,
};

const WarehouseSelector = ({ open, onClose, selected, setSelected }: SelectorProps) => {
  const [filterBy, setFilterBy] = React.useState({
    query: '',
    archived: false,
  });
  const [sortBy, setSortBy] = React.useState({
    updatedAt: 'DESCENDING',
  });
  const { query, ...filters } = filterBy;

  return (
    <SlideView isOpen={open} onRequestClose={onClose}>
      <ArrayValue defaultValue={selected}>
        {({ value: values, push, filter }) => (
          <>
            <SlideViewNavBar>
              <EntityIcon icon="WAREHOUSE" color="WAREHOUSE" />
              <Filter
                config={WarehouseFilterConfig}
                filters={filters}
                onChange={value => setFilterBy({ ...value, query })}
              />
              <SearchInput
                value={query}
                name="search"
                onClear={() =>
                  setFilterBy({
                    ...filterBy,
                    query: '',
                  })
                }
                onChange={value =>
                  setFilterBy({
                    ...filterBy,
                    query: value,
                  })
                }
              />
              <Sort sortBy={sortBy} onChange={setSortBy} config={WarehouseSortConfig} />
              <CancelButton onClick={onClose} />
              <SaveButton
                disabled={isEquals(values, selected)}
                onClick={() => setSelected(values)}
              />
            </SlideViewNavBar>

            <Content>
              <Query
                query={warehousesQuery}
                variables={{ filterBy, sortBy, page: 1, perPage: 20 }}
                fetchPolicy="network-only"
              >
                {({ loading, data, fetchMore, error }) => {
                  if (error) {
                    return error.message;
                  }

                  const nextPage = (data?.warehouses?.page ?? 1) + 1;
                  const totalPage = data?.warehouses?.totalPage ?? 1;
                  const hasMore = nextPage <= totalPage;
                  const nodes = data?.warehouses?.nodes ?? [];

                  return (
                    <GridView
                      onLoadMore={() =>
                        loadMore({ fetchMore, data }, { filterBy, sortBy }, 'warehouses')
                      }
                      hasMore={hasMore}
                      isLoading={loading}
                      isEmpty={nodes.length === 0}
                      emptyMessage={null}
                      itemWidth="195px"
                    >
                      {nodes.map(warehouse => {
                        const isSelected = values.some(id => id === warehouse?.id);
                        return (
                          <WarehouseCard
                            key={warehouse?.id}
                            warehouse={warehouse}
                            selectable
                            selected={isSelected}
                            onSelect={() => {
                              if (isSelected) {
                                filter(id => id !== warehouse?.id);
                              } else {
                                push(warehouse?.id);
                              }
                            }}
                          />
                        );
                      })}
                    </GridView>
                  );
                }}
              </Query>
            </Content>
          </>
        )}
      </ArrayValue>
    </SlideView>
  );
};

const WarehouseIds = ({ value, readonly, onChange }: Props) => {
  return (
    <Ids
      value={value}
      readonly={readonly}
      onChange={onChange}
      title={<FormattedMessage {...messages.warehouses} />}
      selector={WarehouseSelector}
      query={warehousesByIDsQuery}
      getItems={data => data?.warehousesByIDs ?? []}
      renderItem={warehouse => (
        <BaseCard icon="WAREHOUSE" color="WAREHOUSE" wrapperClassName={CardStyle} readOnly>
          <Display height="30px">{warehouse?.name}</Display>
        </BaseCard>
      )}
    />
  );
};

export default WarehouseIds;
