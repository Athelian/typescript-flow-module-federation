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
  columns: Array<string>,
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
  columns: [],
  entities: [],
  focusedAt: null,
  weakFocusedAt: [],
  foreignFocuses: [],
  foreignFocusedAt: [],
};

export const SheetStateContext = React.createContext<{ state: State, dispatch: Action => void }>({
  state: initialState,
  dispatch: () => {},
});

export const useSheetState = () => React.useContext(SheetStateContext);

export const useSheetStateInitializer = (columns: Array<ColumnConfig>, items: Array<Object>) => {
  const { state, dispatch } = useSheetState();

  React.useEffect(() => {
    dispatch({
      type: Actions.INIT,
      payload: {
        items,
        columns: columns.map(c => c.key),
      },
    });
  }, [columns, dispatch, items]);

  React.useEffect(() => {
    if (!state.initialized) {
      return;
    }

    dispatch({
      type: Actions.REARRANGE,
      payload: columns.map(c => c.key),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, dispatch]);
};

export const useSheetStateLoadMore = (onLoadMore: () => Promise<Array<Object>>) => {
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const { dispatch } = useSheetState();

  function handleThreshold() {
    setLoadingMore(true);

    onLoadMore()
      .then(newItems =>
        dispatch({
          type: Actions.APPEND,
          payload: newItems,
        })
      )
      .then(() => setLoadingMore(false));
  }

  return [loadingMore, handleThreshold];
};

export const useSheetKeyNavigation = () => {
  const { dispatch } = useSheetState();

  function handleKey(e: SyntheticKeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        dispatch({
          type: Actions.FOCUS_UP,
        });
        break;
      case 'ArrowDown':
        e.preventDefault();
        dispatch({
          type: Actions.FOCUS_DOWN,
        });
        break;
      case 'ArrowRight':
        e.preventDefault();
        dispatch({
          type: Actions.FOCUS_RIGHT,
        });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        dispatch({
          type: Actions.FOCUS_LEFT,
        });
        break;
      case 'Tab':
        e.preventDefault();
        dispatch({
          type: e.shiftKey ? Actions.FOCUS_LEFT : Actions.FOCUS_RIGHT,
        });
        break;
      default:
        break;
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);
};

export const SheetState = ({ transformItem, children }: Props) => {
  const memoizedReducer = React.useCallback(cellReducer(transformItem), [transformItem]);
  const [state, dispatch] = React.useReducer<State, Action>(memoizedReducer, initialState);

  return (
    <SheetStateContext.Provider value={{ state, dispatch }}>{children}</SheetStateContext.Provider>
  );
};

export default SheetState;
