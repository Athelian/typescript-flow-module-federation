// @flow
import gql from 'graphql-tag';
import { isEnableBetaFeature } from 'utils/env';
import {
  shipmentFormFragment,
  shipmentContainerCardFragment,
  timelineDateFullFragment,
  batchFormFragment,
  userAvatarFragment,
  metricFragment,
  sizeFragment,
  tagFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  documentFragment,
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
} from 'graphql';

export const shipmentFormQuery = isEnableBetaFeature
  ? gql`
      query($id: ID!) {
        shipment(id: $id) {
          ...shipmentFormFragment
        }
      }

      ${shipmentFormFragment}
      ${shipmentContainerCardFragment}
      ${timelineDateFullFragment}
      ${batchFormFragment}
      ${userAvatarFragment}
      ${metricFragment}
      ${sizeFragment}
      ${tagFragment}
      ${priceFragment}
      ${orderCardFragment}
      ${imageFragment}
      ${partnerNameFragment}
      ${shipmentCardFragment}
      ${timelineDateMinimalFragment}
      ${portFragment}
      ${documentFragment}
      ${partnerCardFragment}
      ${customFieldsFragment}
      ${maskFragment}
      ${fieldValuesFragment}
      ${fieldDefinitionFragment}
    `
  : gql`
      query($id: ID!) {
        shipment(id: $id) {
          ...shipmentFormFragment
        }
      }

      ${shipmentFormFragment}
      ${timelineDateFullFragment}
      ${batchFormFragment}
      ${userAvatarFragment}
      ${metricFragment}
      ${sizeFragment}
      ${tagFragment}
      ${priceFragment}
      ${orderCardFragment}
      ${imageFragment}
      ${partnerNameFragment}
      ${shipmentCardFragment}
      ${timelineDateMinimalFragment}
      ${portFragment}
      ${documentFragment}
      ${partnerCardFragment}
      ${customFieldsFragment}
      ${maskFragment}
      ${fieldValuesFragment}
      ${fieldDefinitionFragment}
    `;

export default shipmentFormQuery;
