// @flow
import gql from 'graphql-tag';
import {
  ownedByFragment,
  itemFormFragment,
  priceFragment,
  tagFragment,
  taskCountFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
  partnerCardFragment,
  metricFragment,
  sizeFragment,
  imageFragment,
  batchFormFragment,
  userAvatarFragment,
  customFieldsFragment,
  maskFragment,
  fieldDefinitionFragment,
  fieldValuesFragment,
  itemInBatchFormFragment,
  shipmentCardFragment,
  orderCardFragment,
  portFragment,
  timelineDateMinimalFragment,
  documentFragment,
  productProviderCardFragment,
} from 'graphql';
import { commentFragment, eventFragment } from 'modules/timeline/query';

export const orderItemFormQuery = gql`
  query($id: ID!) {
    orderItem(id: $id) {
      ...itemFormFragment
    }
  }
  ${ownedByFragment}
  ${itemFormFragment}
  ${priceFragment}
  ${tagFragment}
  ${taskCountFragment}
  ${taskWithoutParentInfoFragment}
  ${taskFormInTemplateFragment}
  ${taskTemplateCardFragment}
  ${partnerNameFragment}
  ${metricFragment}
  ${sizeFragment}
  ${imageFragment}
  ${batchFormFragment}
  ${userAvatarFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldDefinitionFragment}
  ${fieldValuesFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${shipmentCardFragment}
  ${orderCardFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${documentFragment}
  ${productProviderCardFragment}
`;

export const orderItemTimelineQuery = gql`
  query orderItemTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    orderItem(id: $id) {
      ... on OrderItem {
        id
        timeline {
          entries(page: $page, perPage: $perPage) {
            nodes {
              ...commentFragment
              ...eventFragment
            }
            page
            totalPage
          }
        }
      }
    }
  }

  ${eventFragment}
  ${commentFragment}
`;
