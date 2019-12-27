// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { navigate } from '@reach/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { FormContainer } from 'modules/form';
import { documentUpdateMutation, prepareParsedDocumentInput } from 'modules/document/form/mutation';
import validator from 'modules/document/form/validator';
import DocumentFormContainer from 'modules/document/form/container';
import DocumentForm from 'modules/document/form';
import { documentQuery } from 'modules/document/form/query';

type Props = {
  documentId?: string,
};

type ImplProps = {
  isLoading: boolean,
  documentId: ?string,
};

const formContainer = new FormContainer();

const DocumentFormModuleImpl = ({ isLoading, documentId }: ImplProps) => {
  const {
    state,
    originalState,
    initializeState,
    isDirty,
    resetState,
  } = DocumentFormContainer.useContainer();

  const [documentMutate, { loading: isProcessing }] = useMutation(documentUpdateMutation);

  React.useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  }, []);

  const handleSave = async () => {
    const input = prepareParsedDocumentInput(originalState, state);

    const { data } = await documentMutate({
      variables: { id: state.id, input },
    });

    const violations = data?.fileUpdate?.violations;

    if (violations && violations.length) {
      formContainer.onErrors(violations);
    } else {
      initializeState(data?.fileUpdate);
      formContainer.onReset();
    }
  };

  return (
    <DocumentForm
      {...(documentId ? { documentId } : {})}
      isDirty={isDirty}
      isValidated={formContainer.isReady(state, validator)}
      resetState={resetState}
      isLoading={isLoading}
      isProcessing={isProcessing}
      handleSave={handleSave}
    />
  );
};

const DocumentFormModule = ({ documentId }: Props) => {
  const { data, loading: isLoading } = useQuery(documentQuery, {
    variables: { id: decodeId(documentId ?? '') },
    fetchPolicy: 'network-only',
    onError: error => {
      if ((error?.message ?? '').includes('403')) {
        navigate('/403');
      }
      logger.error(error);
    },
  });

  return (
    <Provider inject={[formContainer]}>
      <DocumentFormContainer.Provider initialState={data?.file}>
        <DocumentFormModuleImpl isLoading={isLoading} documentId={documentId} />
      </DocumentFormContainer.Provider>
    </Provider>
  );
};

export default DocumentFormModule;
