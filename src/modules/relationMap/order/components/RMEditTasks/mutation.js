// @flow
import gql from 'graphql-tag';
import {
  taskFormFragment,
  userAvatarFragment,
  tagFragment,
  productCardFragment,
  productProviderCardFragment,
  orderCardFragment,
  itemCardFragment,
  batchCardFragment,
  shipmentCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
  todoFragment,
  sizeFragment,
  ownedByFragment,
} from 'graphql';
import { parseTaskField } from 'utils/data';
import { isEquals } from 'utils/fp';

export const taskUpdateManyMutation = gql`
  mutation taskUpdateMany($tasks: [TaskUpdateWrapperInput!]!) {
    taskUpdateMany(tasks: $tasks) {
      ... on Task {
        ...taskFormFragment
      }
    }
  }
  ${taskFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${orderCardFragment}
  ${productCardFragment}
  ${productProviderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${ownedByFragment}
  ${itemCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${todoFragment}
  ${sizeFragment}
`;

export const prepareTasksForUpdateMany = (
  originalValues: Array<Object>,
  values: Array<Object>
): Array<Object> =>
  values
    .map((value, index) => {
      return isEquals(value, originalValues[index])
        ? null
        : { id: value.id, input: parseTaskField(originalValues[index], value) };
    })
    .filter(Boolean);
