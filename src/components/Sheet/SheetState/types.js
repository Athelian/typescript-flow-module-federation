// @flow

import type { ColumnSort } from '../SheetColumns';

export type Position = {
  x: number,
  y: number,
};

export type Area = {
  from: Position,
  to: Position,
};

export type CellValue = {
  columnKey: string,
  entity: {
    id: string,
    type: string,
  } | null,
  data: {
    value: any,
    path: string,
    field: string,
    permissions: ((string) => boolean) => boolean,
    ownedBy: string,
  } | null,
  type: string,
  computed?: Object => any,
  readonly?: boolean,
  disabled?: boolean,
  empty?: boolean,
  merged?: Area,
  forbidden?: boolean,
  duplicatable?: boolean,
  parent?: boolean,
};

type Focus = {
  cell: CellValue,
} & Area;

export type ForeignFocus = {
  id: string,
  user: {
    firstName: string,
    lastName: string,
  },
} & Area;

type Error = {
  cell: CellValue,
  messages: Array<string>,
} & Area;

export type Action = {
  type: string,
  cell?: Position | null,
  payload?: any,
};

export type RowChange = {
  entity: {
    id: string,
    type: string,
  },
} & Area;

type RowChangeOnRemoved = {
  callback: (
    items: Array<Object>
  ) => {
    item: Object,
    index: number,
  } | null,
} & RowChange;

export type State = {
  initialized: boolean,
  items: Array<Object>,
  rows: Array<Array<CellValue>>,
  allRows: Array<Array<CellValue>>,
  columns: Array<string>,
  entities: Array<{ id: string, type: string }>,
  sorts: Array<ColumnSort>,
  hoverAt: Area | null,
  focusAt: Focus | null,
  weakFocusAt: Array<Area>,
  foreignFocuses: Array<Object>,
  foreignFocusesAt: Array<ForeignFocus>,
  errorAt: Error | null,
  weakErrorAt: Array<Area>,
  addedRows: Array<RowChange>,
  removedRows: Array<RowChangeOnRemoved>,
};

export type Mutator = ({
  entity: { id: string, type: string },
  field: string,
  value: any,
  item: Object,
}) => Promise<Array<Object> | null>;
