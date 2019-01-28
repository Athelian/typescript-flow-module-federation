// @flow
import gql from 'graphql-tag';
import {
  sizeFragment,
  metricFragment,
  batchFormFragment,
  tagFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  orderCardFragment,
  userAvatarFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
} from 'graphql';

export const batchSimpleSplitMutation = gql`
  mutation batchSimpleSplit($id: ID!, $input: BatchSimpleSplitInput!) {
    batchSimpleSplit(id: $id, input: $input) {
      ... on Batches {
        batches {
          ...batchFormFragment
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${userAvatarFragment}
  ${shipmentCardFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const batchEqualSplitMutaion = gql`
  mutation batchEqualSplit($id: ID!, $input: BatchEqualSplitInput!) {
    batchEqualSplit(id: $id, input: $input) {
      ... on Batches {
        batches {
          ...batchFormFragment
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${userAvatarFragment}
  ${shipmentCardFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const batchBalanceSplitMutaion = gql`
  mutation batchBalanceSplit($orderItemId: ID!) {
    batchBalanceSplit(orderItemId: $orderItemId) {
      ... on Batches {
        batches {
          ...batchFormFragment
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${userAvatarFragment}
  ${shipmentCardFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;
