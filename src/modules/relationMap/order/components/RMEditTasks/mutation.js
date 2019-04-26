// @flow
import gql from 'graphql-tag';
import {
  taskFormFragment,
  userAvatarFragment,
  tagFragment,
  orderCardFragment,
  batchCardFragment,
  shipmentCardFragment,
  productCardFragment,
  productProviderCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
  todoFragment,
  sizeFragment,
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
  ${orderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${productCardFragment}
  ${productProviderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${todoFragment}
  ${userAvatarFragment}
  ${tagFragment}
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
