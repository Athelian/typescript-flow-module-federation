// @flow
import * as React from 'react';
import type { MaskEdit } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import ActionDialog, {
  ProjectLabelIcon,
  MilestonesLabelIcon,
  TasksLabelIcon,
} from 'components/Dialog/ActionDialog';
import { deleteProjectMutation } from './mutation';

type Props = {|
  entity: MaskEdit,
  isOpen: boolean,
  onSuccess: (projectId: string) => void,
  onCancel: () => void,
|};

const ProjectDeleteDialog = ({ onSuccess, onCancel, entity, isOpen }: Props) => {
  const [deleteProject, { loading: isProcessing }] = useMutation(deleteProjectMutation);

  const onConfirm = () => {
    deleteProject({
      variables: {
        id: entity.id,
      },
    })
      .then(() => {
        onSuccess(entity.id);
      })
      .catch(() => {});
  };

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (isProcessing) {
    // Is currently deleting
    dialogMessage = (
      <FormattedMessage
        id="modules.Project.deleteProject.deleting"
        defaultMessage="Deleting {projectLabel} ..."
        values={{ projectLabel: <ProjectLabelIcon /> }}
      />
    );
  } else {
    // Has permission to delete
    dialogMessage = (
      <FormattedMessage
        id="modules.Project.deleteProject.message1"
        defaultMessage="Are you sure you want to delete this {projectLabel}?"
        values={{ projectLabel: <ProjectLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.Project.deleteProject.message2"
        defaultMessage="All {milestonesLabel} inside will be deleted and all {tasksLabel} inside will be removed but not deleted."
        values={{ milestonesLabel: <MilestonesLabelIcon />, tasksLabel: <TasksLabelIcon /> }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.Project.label.delete" defaultMessage="Delete" />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage id="modules.Project.label.delete" defaultMessage="Delete" />}
          icon="REMOVE"
          onClick={onConfirm}
          backgroundColor="RED"
          hoverBackgroundColor="RED_DARK"
        />
      }
    />
  );
};

export default ProjectDeleteDialog;
