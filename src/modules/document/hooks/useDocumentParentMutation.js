// @flow
import {
  documentUpdateShipmentMutation,
  documentUpdateOrderMutation,
  documentUpdateOrderItemMutation,
  documentUpdateProductMutation,
  documentUpdateProjectMutation,
  prepareParsedDocumentParentInput,
} from 'modules/document/form/mutation';

import { isForbidden } from 'utils/data';
import type { Shipment, Order, OrderItem, Project, Product } from 'generated/graphql';

import { toLowerFirst } from 'utils/string';
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

  // for order, orderItem and shipment entities
  const areValidFiles = (entity: Order | OrderItem | Shipment): boolean => {
    return !entity.files.some(file => isForbidden(file));
  };

  const areValidProductFiles = (entity: Product): boolean => {
    return !entity.productProviders.some(productProvider => {
      return !!productProvider?.files.some(file => isForbidden(file));
    });
  };

  const areValidProjectFiles = (entity: Project): boolean => {
    return !entity.milestones.some(milestone => {
      return !!milestone?.files?.some(file => isForbidden(file));
    });
  };

  // if one of the files is forbidden then do not continue the save
  // else data loss will occur
  const areEntityFilesValid = (data: any, type: string) => {
    if (!data) {
      return false;
    }

    switch (type) {
      case 'Order':
      case 'OrderItem':
      case 'Shipment':
        return areValidFiles(data[toLowerFirst(type)]);
      case 'ProductProvider':
        return areValidProductFiles(data.product);
      case 'Milestone':
        return areValidProjectFiles(data.project);
      default:
        return false;
    }
  };

  const mutation = async ({ type, newState }: { type: string, newState: Object }) => {
    const entity = await getEntity(type, getEntityId(newState));

    if (!entity || !entity.data) {
      return { violations: 'Entity not found' };
    }

    if (!areEntityFilesValid(entity.data, type)) {
      return { violations: 'You do not have permission to update the files' };
    }

    const updated = await updateDocumentParent(entity.data, newState);

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
