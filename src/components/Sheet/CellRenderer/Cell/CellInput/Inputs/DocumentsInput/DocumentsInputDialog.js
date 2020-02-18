// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import Dialog from 'components/Dialog';
import { FormContainer } from 'modules/form';
import { DocumentsUpload as DocumentsSection } from 'components/Form';
import type { FilePayload } from 'generated/graphql';
import { DocumentsDialogWrapperStyle } from './style';

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
  const canAddOrphan = true;
  const canChangeType = true;
  const canDownload = true;
  const canViewForm = false;

  return (
    <Provider inject={[formContainer]}>
      <Dialog isOpen={open} onRequestClose={onClose}>
        <div className={DocumentsDialogWrapperStyle}>
          <DocumentsSection
            files={value}
            entity={entityType}
            onSave={onChange}
            canUpload={canUpload}
            canAddOrphan={canAddOrphan}
            canViewForm={canViewForm}
            canDownload={canDownload}
            canChangeType={canChangeType}
            canDelete={canDelete}
          />
        </div>
      </Dialog>
    </Provider>
  );
};

export default DocumentsInputDialog;
