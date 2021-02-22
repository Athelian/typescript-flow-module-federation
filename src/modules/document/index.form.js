// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { navigate } from '@reach/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { FormContainer } from 'modules/form';
import { documentUpdateMutation, prepareParsedDocumentInput } from 'modules/document/form/mutation';
import { documentQuery } from 'modules/document/form/query';
import validator from 'modules/document/form/validator';
import DocumentFormContainer from 'modules/document/form/container';
import DocumentForm from 'modules/document/form';
import useDocumentParentMutation from './hooks/useDocumentParentMutation';

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

  const [updateParent] = useDocumentParentMutation();
  const [documentMutate] = useMutation(documentUpdateMutation);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  }, []);

  const handleSave = async () => {
    let newDocument = null;

    try {
      setIsProcessing(true);
      // if parent has changed
      if (originalState?.entity?.id !== state?.entity?.id) {
        await updateParent({
          type: state.entity.__typename,
          newState: state,
        });
      }

      const input = prepareParsedDocumentInput(originalState, state);

      const { data: document } = await documentMutate({
        variables: { id: state.id, input },
      });

      newDocument = document;
    } finally {
      setIsProcessing(false);
    }

    const violations = newDocument?.fileUpdate?.violations;

    if (violations && violations.length) {
      formContainer.onErrors(violations);
    } else {
      initializeState(newDocument?.fileUpdate);
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
