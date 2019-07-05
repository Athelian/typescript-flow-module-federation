// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { ProjectCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const ProjectGridView = ({ items, onLoadMore, hasMore, isLoading }: Props) => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.project.noFound" defaultMessage="No projects found" />
      }
      itemWidth="195px"
    >
      {items.map(item => (
        <ProjectCard
          key={item.id}
          project={item}
          onClick={() => navigate(`/project/${encodeId(item.id)}`)}
        />
      ))}
    </GridView>
  );
};

export default ProjectGridView;
