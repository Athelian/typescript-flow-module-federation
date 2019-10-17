// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import Dialog from 'components/Dialog';
import { FormContainer } from 'modules/form';
import { DocumentsInput as DocumentsSection } from 'components/Form';
import type { FilePayload } from 'generated/graphql';
import type { InputProps } from '../../types';

const formContainer = new FormContainer();

const DocumentsInput = ({ value, onChange, onBlur, focus }: InputProps<Array<FilePayload>>) => {
  // TODO: Maxime said to do dummy permission until he changes it
  const canDelete = true;
  const canUpload = true;
  const canUpdateStatus = true;
  const canUpdateType = true;
  const canUpdateMemo = true;
  const canDownload = true;

  return (
    <Provider inject={[formContainer]}>
      <Dialog
        isOpen={focus}
        onRequestClose={() => {
          onBlur();
        }}
      >
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
          onSave={newValue => {
            onChange(newValue);
          }}
          entity="Order"
        />
      </Dialog>
    </Provider>
  );
};

export default DocumentsInput;
