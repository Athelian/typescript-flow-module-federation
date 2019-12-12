// @flow
import * as React from 'react';
import type { SortDirection, Violation } from 'types';
import type { DoAction } from 'components/Sheet/SheetAction/types';

export type ColumnSortConfig = {|
  local?: boolean,
  group: string,
  name: string,
  default?: boolean,
  direction?: SortDirection,
|};

type Column = {|
  key: string,
  exportKey?: string,
  title: React.Node,
  icon: string,
  color: string,
  width: number,
  minWidth?: number,
  hidden?: boolean,
|};

export type ColumnConfig = {|
  ...Column,
  sort?: ColumnSortConfig,
|};

export type ColumnSort = {|
  ...ColumnSortConfig,
  onToggle: () => void,
|};

export type ColumnState = {|
  ...Column,
  onResize: (width: number) => void,
  sort?: ColumnSort,
|};

export type Position = {|
  x: number,
  y: number,
|};

export type Area = {
  from: Position,
  to: Position,
};

export type CellAction = {|
  action: string,
  label: React.Node,
|};

export type CellValue = {|
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
  hide?: Object => boolean,
  extra?: any,
  readonly?: boolean,
  disabled?: boolean,
  empty?: boolean,
  merged?: Area,
  forbidden?: boolean,
  duplicable?: boolean,
  parent?: boolean,
|};

type Focus = {
  ...Area,
  cell: CellValue,
};

export type ForeignFocus = {
  ...Area,
  id: string,
  user: {
    firstName: string,
    lastName: string,
  },
};

type Error = {
  ...Area,
  cell: CellValue,
  violations: Array<Violation>,
};

export type Action = {|
  type: string,
  cell?: Position | null,
  payload?: {|
    entity?: Object,
    value?: mixed,
    item?: Object,
    index?: number,
    changes?: Array<{
      entity: {
        id: string,
        type: string,
      },
      field: string,
      value: any,
    }>,
    focus?: mixed,
    blur?: mixed,
    foreignFocuses?: Array<mixed>,
    items?: Array<Object>,
    columns?: Array<ColumnState>,
    column?: string,
    width?: number,
    direction?: SortDirection,
    violations?: Array<Violation>,
    callback?: (
      Array<Object>
    ) =>
      | {
          item: Object,
          index: number,
        }
      | Array<{
          item: Object,
          index: number,
        }>
      | null,
  |},
|};

export type RowChange = {
  ...Area,
  entity: {
    id: string,
    type: string,
  },
};

export type RowChangeOnRemoved = {
  ...RowChange,
  callback: (
    items: Array<Object>
  ) => {
    item: Object,
    index: number,
  } | null,
};

export type State = {|
  initialized: boolean,
  items: Array<Object>,
  rows: Array<Array<CellValue>>,
  allRows: Array<Array<CellValue>>,
  columns: Array<ColumnState>,
  entities: Array<{ id: string, type: string }>,
  hoverAt: Area | null,
  focusAt: Focus | null,
  weakFocusAt: Array<Area>,
  foreignFocuses: Array<Object>,
  foreignFocusesAt: Array<ForeignFocus>,
  errorAt: Error | null,
  weakErrorAt: Array<Area>,
  addedRows: Array<RowChange>,
  removedRows: Array<RowChangeOnRemoved>,
|};

export type Mutator = ({
  entity: { id: string, type: string },
  field: string,
  oldValue: any,
  newValue: any,
  item: Object,
}) => Promise<Array<Object> | null>;

export type Mutate = ({ cell: Position, value: any, item: Object }) => void;

export type CellData = {|
  item: Object | null,
  cell: CellValue,
  parentCell: CellValue,
  foreignUsers: Array<Object>,
  addedRow: RowChange | null,
  removedRow: RowChangeOnRemoved | null,
  error: Error | null,
  focused: boolean,
  hovered: boolean,
  weakFocused: boolean,
  weakErrored: boolean,
  dispatch: Action => void,
  mutate: Mutate,
  doAction: DoAction,
|};
