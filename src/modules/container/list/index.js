// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { usePrevious } from 'modules/form/hooks';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import logger from 'utils/logger';
import ContainerGridView from './ContainerGridView';
import { containerListQuery } from './query';

type Props = {
  filterBy: {
    query: string,
    archived: boolean,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
};

const ContainerList = ({ ...filtersAndSort }: Props) => {
  const lastFilter = usePrevious(filtersAndSort);
  const [isReady, setIsReady] = React.useState(true);
  React.useEffect(() => {
    if (!isEquals(lastFilter, filtersAndSort)) {
      logger.warn('re-render');
      if (isReady) {
        setIsReady(false);
      }
    } else if (!isReady) {
      setIsReady(true);
    }
  });
  return (
    <Query query={containerListQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'containers.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'containers.totalPage', data);
        const items = getByPathWithDefault([], 'containers.nodes', data);
        const hasMore = nextPage <= totalPage;
        return (
          <ContainerGridView
            items={items}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'containers')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default ContainerList;
