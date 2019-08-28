// @flow
import * as React from 'react';
import type { ColumnConfig } from '../SheetRenderer';
import { cellReducer } from './reducer';
import { Actions } from './contants';

export type CellValue = {
  columnKey: string,
  entity: {
    id: string,
    type: string,
    field: string,
    permissions: () => boolean,
    ownedBy: string,
  } | null,
  data: {
    value: any,
    path: string,
  } | null,
  type: string,
  readonly?: boolean,
  disabled?: boolean,
  empty?: boolean,
  forbidden?: boolean,
  duplicatable?: boolean,
  parent?: boolean,
  extended?: number,
};

export type Position = {
  x: number,
  y: number,
};

export type Focus = {
  cell: CellValue,
} & Position;

export type ForeignFocus = {
  id: string,
  user: {
    firstName: string,
    lastName: string,
  },
} & Position;

export type State = {
  initialized: boolean,
  items: Array<Object>,
  rows: Array<Array<CellValue>>,
  entities: Array<{ id: string, type: string }>,
  focusedAt: Focus | null,
  weakFocusedAt: Array<Position>,
  foreignFocuses: Array<Object>,
  foreignFocusedAt: Array<ForeignFocus>,
};

export type Action = {
  type: string,
  cell?: Position,
  payload?: any,
};

type Props = {
  transformItem: (index: number, item: Object) => Array<Array<CellValue>>,
  children: React.Node,
};

const initialState: State = {
  initialized: false,
  items: [],
  rows: [],
  entities: [],
  focusedAt: null,
  weakFocusedAt: [],
  foreignFocuses: [],
  foreignFocusedAt: [],
};

export const SheetStateContext = React.createContext<[State, (Action) => void]>([
  initialState,
  () => {},
]);

export const useSheetState = () => React.useContext(SheetStateContext);

export const useSheetStateInitializer = (columns: Array<ColumnConfig>, items: Array<Object>) => {
  const [state, dispatch] = useSheetState();

  React.useEffect(() => {
    dispatch({
      type: Actions.INIT,
      payload: {
        items,
        columns,
      },
    });
  }, [columns, dispatch, items]);

  React.useEffect(() => {
    if (!state.initialized) {
      return;
    }

    dispatch({
      type: Actions.REARRANGE,
      payload: columns,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, dispatch]);
};

export const useSheetStateLoadMore = (
  onLoadMore: () => Promise<Array<Object>>,
  columns: Array<ColumnConfig>
) => {
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const [, dispatch] = useSheetState();

  function handleThreshold() {
    setLoadingMore(true);

    onLoadMore()
      .then(newItems =>
        dispatch({
          type: Actions.APPEND,
          payload: {
            items: newItems,
            columns,
          },
        })
      )
      .then(() => setLoadingMore(false));
  }

  return [loadingMore, handleThreshold];
};

export const useSheetKeyNavigation = () => {
  const [, dispatch] = useSheetState();

  function handleKey(e: SyntheticKeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowUp':
        dispatch({
          type: Actions.FOCUS_UP,
        });
        break;
      case 'ArrowDown':
        dispatch({
          type: Actions.FOCUS_DOWN,
        });
        break;
      case 'ArrowRight':
        dispatch({
          type: Actions.FOCUS_RIGHT,
        });
        break;
      case 'ArrowLeft':
        dispatch({
          type: Actions.FOCUS_LEFT,
        });
        break;
      default:
        break;
    }
  }

  return handleKey;
};

export const SheetState = ({ transformItem, children }: Props) => {
  const reducer = React.useReducer<State, Action>(cellReducer(transformItem), initialState);

  return <SheetStateContext.Provider value={reducer}>{children}</SheetStateContext.Provider>;
};

export default SheetState;
