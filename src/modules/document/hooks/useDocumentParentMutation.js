// @flow
// eslint-disable-next-line
import React from 'react';
import {
  documentUpdateShipmentMutation,
  documentUpdateOrderMutation,
  documentUpdateOrderItemMutation,
  documentUpdateProductMutation,
  documentUpdateProjectMutation,
  prepareParsedDocumentParentInput,
} from 'modules/document/form/mutation';

import { orderItemFilesQuery, productFilesQuery } from 'modules/document/form/query';
import { shipmentFormFilesQuery } from 'modules/shipment/form/components/DocumentsSection/query';

import { orderFormFilesQuery } from 'modules/order/form/components/DocumentsSection/query';
import { projectFormQuery } from 'modules/project/form/query';
import { useMutation, useApolloClient } from '@apollo/react-hooks';

/*
 * Update the parent of a document
 */
const useDocumentParentMutation = () => {
  const client = useApolloClient();

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

  /*
   * Queries the parent document
   */
  const getEntity = async (type: string, parentId: string) => {
    const queries = {
      Order: orderFormFilesQuery,
      OrderItem: orderItemFilesQuery,
      Shipment: shipmentFormFilesQuery,
      ProductProvider: productFilesQuery,
      Milestone: projectFormQuery,
    };

    const query = queries[type];

    if (!query) {
      return null;
    }

    return client.query({
      query,
      variables: {
        id: parentId,
      },
      fetchPolicy: 'network-only',
    });
  };

  const updateDocumentParent = async (entity: mixed, state: Object) => {
    const parentInput = prepareParsedDocumentParentInput(state, entity);

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

  const getEntityId = (state: Object) => {
    switch (state.entity.__typename) {
      case 'Milestone':
        return state?.milestone?.project?.id;
      case 'ProductProvider':
        return state?.productProvider?.product?.id;
      default:
        return state?.entity?.id;
    }
  };

  const mutation = async ({ type, newState }: { type: string, newState: Object }) => {
    const entity = await getEntity(type, getEntityId(newState));

    let updated = null;
    if (entity && entity.data) {
      updated = await updateDocumentParent(entity.data, newState);
    }

    return updated;
  };

  return [
    mutation,
    {
      loading:
        isShipmentProcessing ||
        isOrderProcessing ||
        isOrderItemProcessing ||
        isEndProductProcessing ||
        isProjectProcessing,
    },
  ];
};

export default useDocumentParentMutation;
