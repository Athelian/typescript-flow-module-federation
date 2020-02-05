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
  project: Object,
  userId: string
): Object {
  switch (entity.type) {
    case 'Project':
      switch (field) {
        case 'dueDate':
          return {
            [(field: string)]: value ? new Date(value) : null,
          };
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id).filter(Boolean),
          };
        default:
          return {
            [field]: value,
          };
      }
    case 'Milestone':
      switch (field) {
        case 'status':
          switch (value) {
            case 'completed':
              return {
                completedAt: new Date(),
                completedById: userId,
              };
            case 'uncompleted':
              return {
                completedAt: null,
                completedById: null,
              };
            default:
              return {};
          }
        case 'statusDate':
          return {
            completedAt: value.completed.at ? new Date(value.completed.at) : null,
          };
        case 'dueDateBindingData':
          return {
            dueDate: value?.date ? new Date(value?.date) : null,
            dueDateInterval: value?.interval ?? null,
            dueDateBinding: value?.binding ?? null,
          };
        case 'estimatedCompletionDateBindingData':
          return {
            estimatedCompletionDate: value?.date ? new Date(value?.date) : null,
            estimatedCompletionDateInterval: value?.interval ?? null,
            estimatedCompletionDateBinding: value?.binding ?? null,
          };
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, size, ...rest }) => rest
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
            tagIds: value.map(tag => tag.id).filter(Boolean),
          };
        case 'status': {
          switch (value) {
            case 'in_progress':
              return {
                inProgressAt: new Date(),
                inProgressById: userId,
                completedAt: null,
                completedById: null,
                skippedAt: null,
                skippedById: null,
              };
            case 'completed':
              return {
                inProgressAt: null,
                inProgressById: null,
                completedAt: new Date(),
                completedById: userId,
                skippedAt: null,
                skippedById: null,
              };
            case 'skipped':
              return {
                inProgressAt: null,
                inProgressById: null,
                completedAt: null,
                completedById: null,
                skippedAt: new Date(),
                skippedById: userId,
              };
            case 'uncompleted':
              return {
                inProgressAt: null,
                inProgressById: null,
                completedAt: null,
                completedById: null,
                skippedAt: null,
                skippedById: null,
              };
            default:
              return {};
          }
        }
        case 'statusDate':
          return {
            inProgressAt: value.in_progress.at ? new Date(value.in_progress.at) : null,
            completedAt: value.completed.at ? new Date(value.completed.at) : null,
            skippedAt: value.skipped.at ? new Date(value.skipped.at) : null,
          };
        case 'approvalStatus':
          switch (value) {
            case 'approved':
              return {
                approvedAt: new Date(),
                approvedById: userId,
                rejectedAt: null,
                rejectedById: null,
              };
            case 'rejected':
              return {
                approvedAt: null,
                approvedById: null,
                rejectedAt: new Date(),
                rejectedById: userId,
              };
            case 'unapproved':
              return {
                approvedAt: null,
                approvedById: null,
                rejectedAt: null,
                rejectedById: null,
              };
            default:
              return {};
          }
        case 'approvalStatusDate':
          return {
            approvedAt: value.approved.at ? new Date(value.approved.at) : null,
            rejectedAt: value.rejected.at ? new Date(value.rejected.at) : null,
          };
        case 'startDateBindingData':
          return {
            startDate: value?.date ? new Date(value?.date) : null,
            startDateInterval: value?.interval ?? null,
            startDateBinding: value?.binding ?? null,
          };
        case 'dueDateBindingData':
          return {
            dueDate: value?.date ? new Date(value?.date) : null,
            dueDateInterval: value?.interval ?? null,
            dueDateBinding: value?.binding ?? null,
          };
        case 'approvers':
          return {
            approverIds: value.map(user => user.id),
          };
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
export default function(client: ApolloClient, userId: string) {
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
          input: normalizedInput(entity, field, newValue, item, userId),
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
