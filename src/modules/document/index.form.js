// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { navigate } from '@reach/router';
import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks';
import { decodeId } from 'utils/id';
import logger from 'utils/logger';
import { FormContainer } from 'modules/form';
import {
  documentUpdateMutation,
  documentUpdateShipmentMutation,
  documentUpdateOrderMutation,
  documentUpdateOrderItemMutation,
  documentUpdateProductMutation,
  documentUpdateProjectMutation,
  prepareParsedDocumentInput,
  prepareParsedDocumentParentInput,
} from 'modules/document/form/mutation';
import { documentQuery, orderItemFilesQuery, productFilesQuery } from 'modules/document/form/query';
import validator from 'modules/document/form/validator';
import DocumentFormContainer from 'modules/document/form/container';
import DocumentForm from 'modules/document/form';
import { shipmentFormFilesQuery } from 'modules/shipment/form/components/DocumentsSection/query';
import { orderFormFilesQuery } from 'modules/order/form/components/DocumentsSection/query';
import { projectFormQuery } from 'modules/project/form/query';

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
  const client = useApolloClient();

  const [documentMutate, { loading: isDocumentProcessing }] = useMutation(documentUpdateMutation);

  const [documentShipmentMutate, { loading: isShipmentProcessing }] = useMutation(
    documentUpdateShipmentMutation
  );
  const [documentOrderMutate, { loading: isOrderProcessing }] = useMutation(
    documentUpdateOrderMutation
  );
  const [documentOrderItemMutate, { loading: isOrderItemProcessing }] = useMutation(
    documentUpdateOrderItemMutation
  );
  const [documentEndProductMutate, { loading: isEndProductProcessing }] = useMutation(
    documentUpdateProductMutation
  );
  const [documentUpdateProjectMutate, { loading: isProjectProcessing }] = useMutation(
    documentUpdateProjectMutation
  );

  const isProcessing =
    isDocumentProcessing ||
    isShipmentProcessing ||
    isOrderProcessing ||
    isOrderItemProcessing ||
    isEndProductProcessing ||
    isProjectProcessing;

  React.useEffect(() => {
    return () => {
      formContainer.onReset();
    };
  }, []);

  const getEntity = async (type: string, parentId: string) => {
    const queries = {
      Order: orderFormFilesQuery,
      OrderItem: orderItemFilesQuery,
      Shipment: shipmentFormFilesQuery,
      ProductProvider: productFilesQuery,
      Milestone: projectFormQuery,
    };

    const query = queries[type];

    return client.query({
      query,
      variables: {
        id: parentId,
      },
      fetchPolicy: 'network-only',
    });
  };

  // TODO: check with all fields filled on the form
  const updateDocumentParent = async (entity: mixed) => {
    const parentInput = prepareParsedDocumentParentInput(originalState, state, entity);

    const mutations = {
      Order: documentOrderMutate,
      OrderItem: documentOrderItemMutate,
      Shipment: documentShipmentMutate,
      ProductProvider: documentEndProductMutate,
      Milestone: documentUpdateProjectMutate,
    };

    const mutate = mutations[state?.entity?.__typename];

    if (parentInput && mutate) {
      await mutate({
        variables: { id: parentInput.id, input: parentInput.input },
      });
    }
  };

  // get the id of the document parent
  const getEntityId = () => {
    switch (state.entity.__typename) {
      case 'Milestone':
        return state?.milestone?.project?.id;
      case 'ProductProvider':
        return state?.productProvider?.product?.id;
      default:
        return state?.entity?.id;
    }
  };

  const handleSave = async () => {
    // if parent has changed
    if (originalState?.entity?.id !== state?.entity?.id) {
      const entity = await getEntity(state.entity.__typename, getEntityId());

      if (entity && entity.data) {
        await updateDocumentParent(entity.data);
      }
    }

    const input = prepareParsedDocumentInput(originalState, state);

    const { data: newDocument } = await documentMutate({
      variables: { id: state.id, input },
    });

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
