// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import ProjectCard from 'components/Cards/ProjectCard';
import { CardAction } from 'components/Cards/BaseCard';
import DeleteProjectDialog from './DeleteProjectDialog';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const ProjectGridView = ({ items, onLoadMore, hasMore, isLoading }: Props) => {
  const [deletedIds, setDeletedIds] = React.useState([]);

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
      {items.map(item =>
        deletedIds.some(deletedId => deletedId === item.id) ? null : (
          <BooleanValue key={item.id}>
            {({ value: isDeleteDialogOpen, set: setDeleteDialogOpen }) => (
              <>
                <ProjectCard
                  project={item}
                  onClick={() => navigate(`/project/${encodeId(item.id)}`)}
                  actions={[
                    <CardAction
                      icon="REMOVE"
                      hoverColor="RED"
                      onClick={evt => {
                        evt.stopPropagation();
                        setDeleteDialogOpen(true);
                      }}
                    />,
                  ]}
                  showActionsOnHover
                />

                <DeleteProjectDialog
                  isOpen={isDeleteDialogOpen}
                  onCancel={() => setDeleteDialogOpen(false)}
                  entity={item}
                  onSuccess={(id: string) => {
                    setDeleteDialogOpen(false);
                    setDeletedIds([...deletedIds, id]);
                  }}
                />
              </>
            )}
          </BooleanValue>
        )
      )}
    </GridView>
  );
};

export default ProjectGridView;
