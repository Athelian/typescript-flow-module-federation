// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  priceFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
} from 'graphql';
import {
  orderCardRMFragment,
  batchCardRMFragment,
  shipmentCardRMFragment,
} from 'modules/relationMap/order/query';
import { prepareCustomFieldsData } from 'utils/customFields';

// FIXME: test
export const prepareUpdateBatchInput = ({
  id,
  isNew,
  createdAt,
  updatedAt,
  updatedBy,
  orderItem,
  shipment,
  container,
  deliveredAt,
  desiredAt,
  expiredAt,
  customFields,
  producedAt,
  tags = [],
  batchQuantityRevisions = [],
  totalVolume,
  archived,
  ...rest
}: Object): Object =>
  !isNew
    ? { id }
    : {
        ...rest,
        deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
        desiredAt: desiredAt ? new Date(desiredAt) : null,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        customFields: prepareCustomFieldsData(customFields),
        producedAt: producedAt ? new Date(producedAt) : null,
        tagIds: tags.map(({ id: tagId }) => tagId),
        batchQuantityRevisions: batchQuantityRevisions.map(
          ({
            isNew: isNewBatchQuantityRevisions,
            id: batchQuantityRevisionId,
            createdAt: batchQuantityRevisionCreatedAt,
            updatedAt: batchQuantityRevisionUpdateAt,
            updatedBy: batchQuantityRevisionUpdatedBy,
            sort,
            ...others
          }) => ({
            ...others,
            ...(isNewBatchQuantityRevisions ? {} : { id: batchQuantityRevisionId }),
          })
        ),
      };

export const updateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...orderCardRMFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${orderCardRMFragment}
  ${batchCardRMFragment}
  ${shipmentCardRMFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${priceFragment}
  ${taskFormInTemplateFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
`;

export const prepareUpdateOrderInput = ({ orderItems = [] }: Object): Object => ({
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, order, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      ...(isNew ? {} : { id: itemId }),
      productProviderId: productProvider.id,
      batches: batches.map(batch => prepareUpdateBatchInput(batch)),
    })
  ),
});
