// @flow
import { ApolloClient } from 'apollo-client';
import type { Action } from 'components/Sheet/SheetState/types';
import type { EntityEvent, EntityEventChange } from 'components/Sheet/SheetLive/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import { extractChangeNewValue } from 'components/Sheet/SheetLive/helper';
import { handleTaskChanges } from 'modules/sheet/task/handler';
import { taskByIDQuery } from './query';

// eslint-disable-next-line import/prefer-default-export
export function handleFieldValueEvent(dispatch: Action => void, event: EntityEvent) {
  const change = event.changes.find(c => c.field === 'value');
  if (change) {
    dispatch({
      type: Actions.CHANGE_VALUES,
      payload: {
        changes: [
          {
            entity: {
              id: event.entity.entity.id,
              type: event.entity.entity.__typename,
            },
            field: `@${event.entity.fieldDefinition.id}`,
            value: change.new?.string ?? null,
          },
        ],
      },
    });
  }
}

export async function handleTaskEvent(
  client: ApolloClient<any>,
  dispatch: Action => void,
  todo: Object,
  event: EntityEvent
) {
  let newTodo = { ...todo };

  switch (event.lifeCycle) {
    case 'Create': {
      const task = await client
        .query({
          query: taskByIDQuery,
          variables: { id: event.entity.id },
        })
        .then(({ data }) => data.task);

      newTodo = {
        ...newTodo,
        tasks: [...newTodo.tasks, task].filter(t => !!t.id).sort((a, b) => a.sort - b.sort),
      };
      break;
    }
    case 'Update': {
      const changes = await handleTaskChanges(client, event.changes);

      newTodo = {
        ...newTodo,
        tasks: newTodo.tasks.map(t => {
          if (t.id !== event.entity.id) {
            return t;
          }

          let newTask = { ...t };
          changes.forEach((change: EntityEventChange) => {
            newTask = {
              ...newTask,
              [change.field]: extractChangeNewValue(change),
            };
          });

          return newTask;
        }),
      };
      break;
    }
    case 'Delete':
      newTodo = {
        ...newTodo,
        tasks: newTodo.tasks.filter(t => t.id !== event.entity.id),
      };
      break;
    default:
      break;
  }

  dispatch({
    type: Actions.CHANGE_VALUES,
    payload: {
      changes: [
        {
          entity: {
            id: event.entity.parentEntity?.id,
            type: event.entity.parentEntity?.__typename,
          },
          field: 'todo',
          value: newTodo,
        },
      ],
    },
  });
}
