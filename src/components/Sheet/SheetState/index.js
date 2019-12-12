// @flow
import * as React from 'react';
import { equals } from 'ramda';
import { hasInPortal } from 'hooks/usePortalSlot';
import { DIALOG_PORTAL_NAME } from 'components/Dialog';
import { SLIDEVIEW_PORTAL_NAME } from 'components/SlideView';
import cellReducer from './reducer';
import { Actions } from './constants';
import type { Action, CellValue, State, Mutator, ColumnConfig, ColumnSort, Mutate } from './types';

type Props = {|
  items: Array<Object>,
  columns: Array<ColumnConfig>,
  transformItem: (index: number, item: Object) => Array<Array<CellValue>>,
  onLocalSort: (Array<Object>, Array<ColumnSort>) => Array<Object>,
  onRemoteSort: (sorts: Array<ColumnSort>) => void,
  onMutate: Mutator,
  children: React.Node,
|};

const initialState: State = {
  initialized: false,
  items: [],
  rows: [],
  allRows: [],
  columns: [],
  columnSorts: [],
  entities: [],
  hoverAt: null,
  focusAt: null,
  weakFocusAt: [],
  foreignFocuses: [],
  foreignFocusesAt: [],
  errorAt: null,
  weakErrorAt: [],
  addedRows: [],
  removedRows: [],
};

type Context = {|
  state: State,
  dispatch: Action => void,
  mutate: Mutate,
|};

export const SheetStateContext = React.createContext<Context>({
  state: initialState,
  dispatch: () => {},
  mutate: () => {},
});

export const useSheetState = (): Context => React.useContext(SheetStateContext);

export const useSheetStateLoadMore = (
  onLoadMore: () => Promise<Array<Object>>
): [boolean, () => Promise<any>] => {
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);
  const { dispatch } = useSheetState();

  const handleThreshold = React.useCallback(() => {
    setLoadingMore(true);

    return onLoadMore()
      .then(newItems =>
        dispatch({
          type: Actions.APPEND,
          payload: {
            items: newItems,
          },
        })
      )
      .then(() => setLoadingMore(false));
  }, [setLoadingMore, onLoadMore, dispatch]);

  return [loadingMore, handleThreshold];
};

export const useSheetKeyNavigation = () => {
  const { dispatch } = useSheetState();

  const handleKey = React.useCallback(
    (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
      if (hasInPortal(DIALOG_PORTAL_NAME) || hasInPortal(SLIDEVIEW_PORTAL_NAME)) {
        return;
      }

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
    },
    [dispatch]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', handleKey);

    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);
};

export const SheetState = ({
  items,
  columns,
  transformItem,
  onMutate,
  onLocalSort,
  onRemoteSort,
  children,
}: Props) => {
  const memoizedReducer = React.useCallback(cellReducer(transformItem, onLocalSort), [
    transformItem,
    onLocalSort,
  ]);
  const [state, dispatch] = React.useReducer<State, Action>(memoizedReducer, initialState);
  const addedRowsRef = React.useRef([]);
  const removedRowsRef = React.useRef([]);
  const remoteSortsRef = React.useRef<Array<ColumnSort>>([]);
  const memoizedMutate = React.useCallback(
    ({ cell, value, item }) => {
      const cellValue = state.rows[cell.x][cell.y];
      if (!cellValue.entity || !cellValue.data) {
        return;
      }

      dispatch({
        type: Actions.CELL_UPDATE,
        cell,
        payload: {
          value,
        },
      });

      onMutate({
        entity: {
          id: cellValue?.entity?.id ?? '',
          type: cellValue?.entity?.type ?? '',
        },
        field: cellValue?.data?.field ?? '',
        oldValue: cellValue?.data?.value,
        newValue: value,
        item,
      }).then(violations => {
        if (violations === null) {
          return;
        }

        dispatch({
          type: Actions.CELL_UPDATE,
          cell,
          payload: {
            value: cellValue?.data?.value,
          },
        });

        dispatch({
          type: Actions.SET_ERROR,
          cell,
          payload: {
            violations,
          },
        });
      });
    },
    [onMutate, state.rows, dispatch]
  );

  React.useEffect(() => {
    dispatch({
      type: Actions.INIT,
      payload: {
        items,
      },
    });
  }, [items]);

  React.useEffect(() => {
    dispatch({
      type: Actions.REARRANGE_COLUMNS,
      payload: {
        columns,
      },
    });
  }, [columns]);

  React.useEffect(() => {
    const remoteSorts = state.columnSorts.filter(s => !s?.local);

    if (!equals(remoteSorts, remoteSortsRef.current)) {
      remoteSortsRef.current = remoteSorts;
      onRemoteSort(remoteSorts);
    }
  }, [state.columnSorts, onRemoteSort]);

  React.useEffect(() => {
    if (!state.errorAt) {
      return () => {};
    }

    const handler = setTimeout(() => {
      dispatch({
        type: Actions.CLEAR_ERROR,
      });
    }, 8000);

    return () => {
      clearTimeout(handler);
    };
  }, [state.errorAt, dispatch]);

  React.useEffect(() => {
    const toTimeout = state.addedRows.filter(
      addedRow =>
        addedRowsRef.current.findIndex(previousAddedRow => previousAddedRow === addedRow) === -1
    );

    toTimeout.forEach(addedRow => {
      setTimeout(() => {
        dispatch({
          type: Actions.POST_ADD_ENTITY,
          payload: {
            entity: addedRow.entity,
          },
        });
      }, 5000);
    });

    addedRowsRef.current = state.addedRows;
  }, [state.addedRows, dispatch]);

  React.useEffect(() => {
    const toTimeout = state.removedRows.filter(
      removedRow =>
        removedRowsRef.current.findIndex(
          previousRemovedRow => previousRemovedRow === removedRow
        ) === -1
    );

    toTimeout.forEach(removedRow => {
      setTimeout(() => {
        dispatch({
          type: Actions.POST_REMOVE_ENTITY,
          payload: {
            entity: removedRow.entity,
          },
        });
      }, 5000);
    });

    removedRowsRef.current = state.removedRows;
  }, [state.removedRows, dispatch]);

  return (
    <SheetStateContext.Provider value={{ state, dispatch, mutate: memoizedMutate }}>
      {children}
    </SheetStateContext.Provider>
  );
};

export default SheetState;
