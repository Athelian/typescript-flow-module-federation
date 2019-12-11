// @flow
import ApolloClient from 'apollo-client';
import { projectMutation, milestoneMutation, taskMutation } from './query';

const mutations = {
  Project: projectMutation,
  Milestone: milestoneMutation,
  Task: taskMutation,
};

function normalizedInput(
  entity: Object,
  field: string,
  value: any,
  // eslint-disable-next-line no-unused-vars
  project: Object
): Object {
  switch (entity.type) {
    case 'Project':
      switch (field) {
        case 'dueDate':
          return {
            [(field: string)]: new Date(value),
          };
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id),
          };
        default:
          return {
            [field]: value,
          };
      }
    case 'Milestone':
      switch (field) {
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, ...rest }) => rest
            ),
          };
        default:
          return {
            [field]: value,
          };
      }
    case 'Task':
      switch (field) {
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id),
          };
        case 'approved':
          return {
            approvedById: value?.user?.id ?? null,
            approvedAt: value?.date ?? null,
          };
        case 'startDateBindingData': {
          const date = value?.date ?? null;
          if (date) {
            return {
              startDate: new Date(date),
            };
          }
          return {
            startDateInterval: value?.interval ?? null,
            startDateBinding: value?.binding ?? null,
          };
        }
        case 'dueDateBindingData': {
          const date = value?.date ?? null;
          if (date) {
            return {
              dueDate: new Date(date),
            };
          }
          return {
            dueDateInterval: value?.interval ?? null,
            dueDateBinding: value?.binding ?? null,
          };
        }
        default:
          return {
            [field]: value,
          };
      }
    default:
      return {
        [field]: value,
      };
  }
}

// $FlowFixMe not compatible with hook implementation
export default function(client: ApolloClient) {
  return function mutate({
    entity,
    field,
    newValue,
    item,
  }: {
    entity: Object,
    field: string,
    oldValue: any,
    newValue: any,
    item: Object,
  }): Promise<Array<Object> | null> {
    return client
      .mutate({
        mutation: mutations[entity.type],
        variables: {
          id: entity.id,
          input: normalizedInput(entity, field, newValue, item),
        },
      })
      .then(({ data }) => {
        const result =
          data?.[`${entity.type.charAt(0).toLowerCase() + entity.type.slice(1)}Update`];

        switch (result?.__typename) {
          case 'Forbidden':
            return [{ message: 'Forbidden' }];
          case 'BadRequest':
            return result?.violations;
          default:
            return null;
        }
      });
  };
}
