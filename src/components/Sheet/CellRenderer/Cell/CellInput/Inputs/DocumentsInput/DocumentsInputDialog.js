// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import Dialog from 'components/Dialog';
import { FormContainer } from 'modules/form';
import { DocumentsInput as DocumentsSection } from 'components/Form';
import type { FilePayload } from 'generated/graphql';
import type { InputProps } from '../../types';
import DocumentsContainer from './container';

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const formContainer = new FormContainer();
const documentsContainer = new DocumentsContainer();

const DocumentsInput = ({ value, onChange, onBlur, focus }: InputProps<Array<FilePayload>>) => {
  // TODO: Maxime said to do dummy permission until he changes it
  const canDelete = true;
  const canUpload = true;
  const canUpdateStatus = true;
  const canUpdateType = true;
  const canUpdateMemo = true;
  const canDownload = true;

  const { state, setFieldValue, initDetailValues } = documentsContainer;

  const prevFocus = usePrevious(focus);

  React.useEffect(() => {
    if (!prevFocus && focus) {
      initDetailValues(value);
    } else if (prevFocus && !focus) {
      initDetailValues([]);
    }
  }, [focus, initDetailValues, prevFocus, value]);

  return (
    <Provider inject={[formContainer, documentsContainer]}>
      <Dialog
        isOpen={focus}
        onRequestClose={() => {
          onChange(state.files);
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
          files={state.files}
          onSave={setFieldValue}
          entity="Order"
        />
      </Dialog>
    </Provider>
  );
};

export default DocumentsInput;
