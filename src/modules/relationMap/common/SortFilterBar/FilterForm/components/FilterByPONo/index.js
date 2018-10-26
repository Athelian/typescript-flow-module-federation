// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import { FormattedMessage } from 'react-intl';
import { SearchInput } from 'components/NavBar';
import { SortFilterHandler } from 'modules/relationMap/common/SortFilter';
import PONoGridView from './PONoGridView';
import { orderListQuery } from './query';

import { FilterByPONoLabel } from './style';

type OptionalProps = {
  filter: {
    query: string,
    archived: boolean,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

type Props = OptionalProps & {};

const defaultProps = {
  viewType: 'grid',
  filter: {
    query: '',
    archived: false,
  },
  sort: {
    field: 'updatedAt',
    direction: 'DESCENDING',
  },
  perPage: 10,
};

class FilterByPONo extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { perPage } = this.props;
    return (
      <SortFilterHandler>
        {({ sort, filter, onChangeSortFilter }) => (
          <Query
            query={orderListQuery}
            variables={{
              page: 1,
              filterBy: {
                ...filter,
              },
              sortBy: {
                [sort.field]: sort.direction,
              },
              perPage,
            }}
            fetchPolicy="network-only"
          >
            {({ loading, data, fetchMore, error }) => {
              if (error) {
                return error.message;
              }

              const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
              const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
              const hasMore = nextPage <= totalPage;

              return (
                <>
                  <div className={FilterByPONoLabel}>
                    <span>
                      <FormattedMessage
                        id="modules.relationMap.filter.toSelectPoNo"
                        defaultMessage="TO SELECT PO NO."
                      />
                    </span>
                    <SearchInput
                      name="filter"
                      value={filter.query}
                      onClear={() => onChangeSortFilter({ filter: { query: '' } })}
                      onChange={newQuery => onChangeSortFilter({ filter: { query: newQuery } })}
                    />
                  </div>
                  <PONoGridView
                    items={getByPathWithDefault([], 'orders.nodes', data)}
                    onLoadMore={() => loadMore({ fetchMore, data }, { filter, sort }, 'orders')}
                    hasMore={hasMore}
                    isLoading={loading}
                  />
                </>
              );
            }}
          </Query>
        )}
      </SortFilterHandler>
    );
  }
}

export default FilterByPONo;
