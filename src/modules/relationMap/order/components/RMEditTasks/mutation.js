// @flow
import gql from 'graphql-tag';
import { parseTaskField } from 'utils/data';
import { isEquals } from 'utils/fp';

export const taskUpdateManyMutation = gql`
  mutation taskUpdateMany($tasks: [TaskUpdateWrapperInput!]!) {
    taskUpdateMany(tasks: $tasks) {
      ... on Task {
        id
      }
    }
  }
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
    .filter(item => item);
