// @flow
import React from 'react';
import { Query } from 'react-apollo';
import logger from 'utils/logger';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import { projectListQuery } from './query';
import ProjectGridView from './ProjectGridView';

type Props = {
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
};

const ProjectList = ({ ...filtersAndSort }: Props) => {
  return (
    <Query
      query={projectListQuery}
      variables={{
        page: 1,
        ...filtersAndSort,
      }}
      fetchPolicy="network-only"
      onCompleted={logger.warn}
      onError={logger.error}
    >
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'projects.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'projects.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <ProjectGridView
            items={getByPathWithDefault([], 'projects.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'projects')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default ProjectList;
