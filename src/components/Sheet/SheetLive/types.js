// @flow
import type { Action } from 'components/Sheet/SheetState/types';

export type EntityEventChange = {
  field: string,
  new: {
    // prettier-ignore
    __typename: 'StringValue'
      | 'IntValue'
      | 'FloatValue'
      | 'BooleanValue'
      | 'DateTimeValue'
      | 'MetricValueValue'
      | 'SizeValue'
      | 'EntityValue'
      | 'CustomValue',
    string?: string | null,
    int?: number | null,
    float?: number | null,
    boolean?: boolean | null,
    datetime?: string | Date | null,
    metricValue?: { value: number, metric: string } | null,
    size?: {
      width: { value: number, metric: string },
      height: { value: number, metric: string },
      length: { value: number, metric: string },
    } | null,
    entity?: { id: string },
    custom?: any,
  } | null,
};

export type EntityEvent = {
  lifeCycle: 'Create' | 'Update' | 'Delete',
  entity: Object,
  changes: Array<EntityEventChange>,
};

export type EntityEventHandler = (event: EntityEvent, items: Array<Object>) => Promise<void> | void;
export type EntityEventHandlerFactory = (dispatch: (Action) => void) => EntityEventHandler;
