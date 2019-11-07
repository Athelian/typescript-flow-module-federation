// @flow
import type { MetricValue } from 'types';
import type { Action } from 'components/Sheet/SheetState/types';

type ChangeValue = {
  // prettier-ignore
  __typename: 'StringValue'
    | 'IntValue'
    | 'FloatValue'
    | 'BooleanValue'
    | 'DateTimeValue'
    | 'MetricValueValue'
    | 'SizeValue'
    | 'EntityValue'
    | 'Values'
    | 'CustomValue',
  string?: string | null,
  int?: number | null,
  float?: number | null,
  boolean?: boolean | null,
  datetime?: string | Date | null,
  metricValue?: MetricValue | null,
  size?: {
    width: MetricValue,
    height: MetricValue,
    length: MetricValue,
  } | null,
  entity?: { id: string },
  custom?: any,
  values?: Array<ChangeValue>,
};

export type EntityEventChange = {
  field: string,
  new: ChangeValue | null,
};

export type EntityEvent = {
  lifeCycle: 'Create' | 'Update' | 'Delete',
  entity: Object,
  changes: Array<EntityEventChange>,
};

export type EntityEventHandler = (event: EntityEvent, items: Array<Object>) => Promise<void> | void;
export type EntityEventHandlerFactory = (dispatch: (Action) => void) => EntityEventHandler;
