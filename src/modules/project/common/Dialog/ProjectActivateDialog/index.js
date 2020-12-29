// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import ActivateDialog from 'components/Dialog/ActivateDialog';
import { updateProjectMutation } from 'modules/project/form/mutation';
import { spanWithColor } from 'utils/color';
import emitter from 'utils/emitter';
import messages from './messages';
import { type ProjectDialogProps, defaultProps } from '../type';
import { MessageStyle } from '../style';

const ProjectActivateDialog = ({
  isOpen,
  onRequestClose,
  project,
  onConfirm,
}: ProjectDialogProps) => {
  const { id: projectId } = project;

  return (
    <ApolloConsumer>
      {client => (
        <ActivateDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            await client.mutate({
              mutation: updateProjectMutation,
              variables: {
                id: projectId,
                input: {
                  archived: false,
                },
              },
            });
            emitter.emit('CHANGE_PROJECT_STATUS', projectId);
            onRequestClose();
            onConfirm();
          }}
          message={
            <div className={MessageStyle}>
              <div>
                <FormattedMessage
                  {...messages.confirmMsg}
                  values={{
                    project: spanWithColor(<FormattedMessage {...messages.project} />, 'PROJECT'),
                  }}
                />
              </div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
};

ProjectActivateDialog.defaultProps = defaultProps;

export default ProjectActivateDialog;
