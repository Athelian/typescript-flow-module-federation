// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  PROJECT_UPDATE,
  PROJECT_DELETE,
  PROJECT_SET_ARCHIVED,
} from 'modules/permission/constants/project';
import usePermission from 'hooks/usePermission';
import GridView from 'components/GridView';
import ProjectGridItem from '../ProjectGridItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const ProjectGridView = ({ items, onLoadMore, hasMore, isLoading }: Props) => {
  const { hasPermission } = usePermission();
  const [deletedIds, setDeletedIds] = React.useState([]);
  const allowDelete = hasPermission(PROJECT_DELETE);
  const allowChangeStatus = hasPermission(PROJECT_UPDATE) || hasPermission(PROJECT_SET_ARCHIVED);

  const onDeleteItemSuccess = React.useCallback((deletedProjectId: string) => {
    setDeletedIds(_deletedIds => [..._deletedIds, deletedProjectId]);
  }, []);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.project.noFound" defaultMessage="No projects found" />
      }
      itemWidth="645px"
    >
      {items
        .filter(item => !deletedIds.some(deletedId => deletedId === item.id))
        .map(item => (
          <ProjectGridItem
            key={item.id}
            item={item}
            onDeleteItemSuccess={onDeleteItemSuccess}
            allowDelete={allowDelete}
            allowChangeStatus={allowChangeStatus}
          />
        ))}
    </GridView>
  );
};

export default ProjectGridView;
