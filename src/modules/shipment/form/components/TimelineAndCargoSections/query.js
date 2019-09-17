// @flow
import gql from 'graphql-tag';
import {
  timelineDateFullFragment,
  containerFormFragment,
  userAvatarFragment,
  warehouseCardFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  metricFragment,
  tagFragment,
  batchFormFragment,
  sizeFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskWithoutParentInfoFragment,
  taskCountFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
  productProviderPackagingFragment,
} from 'graphql';

export const shipmentFormTimelineAndCargoQuery = gql`
  query shipmentFormTimelineAndCargoQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        containers {
          ...containerFormFragment
        }

        batches {
          ...batchFormFragment
        }
        cargoReady {
          ...timelineDateFullFragment
        }
        voyages {
          ... on Voyage {
            id
            vesselName
            vesselCode
            departurePort {
              ...portFragment
            }
            arrivalPort {
              ...portFragment
            }
            departure {
              ...timelineDateFullFragment
            }
            arrival {
              ...timelineDateFullFragment
            }
          }
        }
        containerGroups {
          ... on ContainerGroup {
            id
            warehouse {
              ... on Warehouse {
                id
                name
                ownedBy {
                  ... on Organization {
                    id
                    name
                  }
                }
              }
            }
            customClearance {
              ...timelineDateFullFragment
            }
            warehouseArrival {
              ...timelineDateFullFragment
            }
            deliveryReady {
              ...timelineDateFullFragment
            }
          }
        }
      }
    }
  }

  ${timelineDateFullFragment}
  ${containerFormFragment}
  ${userAvatarFragment}
  ${warehouseCardFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${metricFragment}
  ${tagFragment}
  ${batchFormFragment}
  ${sizeFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${productProviderPackagingFragment}
`;

export default shipmentFormTimelineAndCargoQuery;
