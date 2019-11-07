// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import Dialog from 'components/Dialog';
import { FormContainer } from 'modules/form';
import { DocumentsInput as DocumentsSection } from 'components/Form';
import type { FilePayload } from 'generated/graphql';

const formContainer = new FormContainer();

type Props = {
  value: Array<FilePayload>,
  onChange: (Array<FilePayload>) => void,
  open: boolean,
  onClose: () => void,
  entityType: string,
};

const DocumentsInputDialog = ({ value, onChange, onClose, open, entityType }: Props) => {
  // TODO: Maxime said to do dummy permission until he changes it
  const canDelete = true;
  const canUpload = true;
  const canUpdateStatus = true;
  const canUpdateType = true;
  const canUpdateMemo = true;
  const canDownload = true;

  return (
    <Provider inject={[formContainer]}>
      <Dialog isOpen={open} onRequestClose={onClose}>
        <DocumentsSection
          removable={canDelete}
          uploadable={canUpload}
          editable={{
            status: canUpdateStatus,
            type: canUpdateType,
            memo: canUpdateMemo,
          }}
          downloadable={canDownload}
          files={value}
          onSave={onChange}
          entity={entityType}
        />
      </Dialog>
    </Provider>
  );
};

export default DocumentsInputDialog;
