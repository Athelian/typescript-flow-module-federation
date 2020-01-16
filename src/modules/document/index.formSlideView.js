// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import type { FilePayload } from 'generated/graphql';
import { encodeId } from 'utils/id';
import { FormContainer } from 'modules/form';
import { SlideViewLayout } from 'components/Layout';
import validator from 'modules/document/form/validator';
import DocumentFormContainer from 'modules/document/form/container';
import DocumentForm from 'modules/document/form';

type Props = {
  onSave: Object => void,
  file: FilePayload,
};

const formContainer = new FormContainer();

const DocumentFormImpl = ({
  onSave,
  documentId,
}: {
  onSave: Object => void,
  documentId: string,
}) => {
  const { state, isDirty, resetState } = DocumentFormContainer.useContainer();
  return (
    <DocumentForm
      isDirty={isDirty}
      isValidated={formContainer.isReady(state, validator)}
      resetState={resetState}
      isSlideView
      handleSave={() => onSave(state)}
      documentId={encodeId(documentId)}
    />
  );
};

const DocumentFormSlideView = ({ onSave, file }: Props) => {
  React.useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  }, []);

  return (
    <Provider inject={[formContainer]}>
      <DocumentFormContainer.Provider initialState={file}>
        <SlideViewLayout>
          <DocumentFormImpl onSave={onSave} documentId={file.id} />
        </SlideViewLayout>
      </DocumentFormContainer.Provider>
    </Provider>
  );
};

export default DocumentFormSlideView;
