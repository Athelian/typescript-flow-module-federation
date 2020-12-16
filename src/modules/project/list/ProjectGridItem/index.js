// @flow
import React from 'react';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import ProjectCard from 'components/Cards/ProjectCard';
import { CardAction } from 'components/Cards/BaseCard';
import {
  ProjectDeleteDialog,
  ProjectActivateDialog,
  ProjectArchiveDialog,
} from 'modules/project/common/Dialog';

type Props = {
  item: Object,
  allowDelete: Boolean,
  allowChangeStatus: Boolean,
};

const ProjectGridItem = ({ item, allowDelete, allowChangeStatus }: Props) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isStatusDialogOpen, setStatusDialogOpen] = React.useState(false);

  return (
    <>
      <ProjectDeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        entity={item}
        onSuccess={() => {
          setDeleteDialogOpen(false);
        }}
      />

      {item.archived ? (
        <ProjectActivateDialog
          onRequestClose={() => setStatusDialogOpen(false)}
          isOpen={isStatusDialogOpen}
          project={item}
        />
      ) : (
        <ProjectArchiveDialog
          onRequestClose={() => setStatusDialogOpen(false)}
          isOpen={isStatusDialogOpen}
          project={item}
        />
      )}

      <ProjectCard
        project={item}
        onClick={() => navigate(`/project/${encodeId(item.id)}`)}
        actions={[
          allowChangeStatus && (
            <CardAction
              icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
              onClick={evt => {
                evt.stopPropagation();
                setStatusDialogOpen(true);
              }}
            />
          ),
          allowDelete && (
            <CardAction
              icon="REMOVE"
              hoverColor="RED"
              onClick={evt => {
                evt.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            />
          ),
        ]}
        showActionsOnHover
      />
    </>
  );
};

export default ProjectGridItem;
