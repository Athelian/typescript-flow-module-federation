// @flow
import type { Action } from 'components/Sheet/SheetState/types';
import type { EntityEvent } from 'components/Sheet/SheetLive/types';
import { Actions } from 'components/Sheet/SheetState/constants';

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
