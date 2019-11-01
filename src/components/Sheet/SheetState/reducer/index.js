// @flow
import logger from 'utils/logger';
import type {
  Action,
  CellValue,
  Position,
  State,
  ColumnSort,
} from 'components/Sheet/SheetState/types';
import { Actions } from '../constants';
import { append, init, rearrangeColumns, resizeColumn, sortColumn } from './sheet';
import {
  appendForeignFocuses,
  foreignBlur,
  foreignFocus,
  setForeignFocuses,
} from './foreign-focus';
import { clearError, setError } from './error';
import { blur, focus, focusDown, focusLeft, focusRight, focusUp } from './focus';
import { cellUpdate, changeValues, deleteItem, replaceItem } from './mutate';
import { postAddEntity, postRemoveEntity, preAddEntity, preRemoveEntity } from './announcement';
import { hover, unhover } from './hover';

const InvalidAction = new Error('Invalid action');
const MissingPayload = new Error('Invalid action, missing payload.');
const MissingTarget = new Error('Invalid action, missing target cell position.');

function getPayload(action: Action): any {
  if (!action.payload) {
    throw MissingPayload;
  }

  return action.payload;
}

function getPosition(action: Action): Position {
  if (!action.cell) {
    throw MissingTarget;
  }

  return action.cell;
}

function getTarget(state: State, action: Action) {
  const pos = getPosition(action);

  return state.rows[pos.x][pos.y];
}

export default function cellReducer(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (state: State, action: Action) => {
    logger.info('Sheet state reducer', action);

    switch (action.type) {
      case Actions.INIT:
        return init(transformer, sorter)(state, getPayload(action));
      case Actions.APPEND:
        return append(transformer, sorter)(state, getPayload(action));
      case Actions.REARRANGE_COLUMNS:
        return rearrangeColumns(transformer, sorter)(state, getPayload(action));
      case Actions.RESIZE_COLUMN:
        return resizeColumn(state, getPayload(action));
      case Actions.SORT_COLUMN:
        return sortColumn(transformer, sorter)(state, getPayload(action));
      case Actions.CELL_UPDATE:
        return cellUpdate(state, getPayload(action), getTarget(state, action));
      case Actions.CHANGE_VALUES:
        return changeValues(state, getPayload(action));
      case Actions.REPLACE_ITEM:
        return replaceItem(transformer, sorter)(state, getPayload(action));
      case Actions.DELETE_ITEM:
        return deleteItem(transformer, sorter)(state, getPayload(action));
      case Actions.SET_ERROR:
        return setError(state, getPayload(action), getTarget(state, action), getPosition(action));
      case Actions.CLEAR_ERROR:
        return clearError(state);
      case Actions.HOVER:
        return hover(state, getTarget(state, action), getPosition(action));
      case Actions.UNHOVER:
        return unhover(state);
      case Actions.FOCUS:
        return focus(state, getTarget(state, action), getPosition(action));
      case Actions.BLUR:
        return blur(state);
      case Actions.FOCUS_UP:
        return focusUp(state);
      case Actions.FOCUS_DOWN:
        return focusDown(state);
      case Actions.FOCUS_RIGHT:
        return focusRight(state);
      case Actions.FOCUS_LEFT:
        return focusLeft(state);
      case Actions.SET_FOREIGN_FOCUSES:
        return setForeignFocuses(state, getPayload(action));
      case Actions.APPEND_FOREIGN_FOCUSES:
        return appendForeignFocuses(state, getPayload(action));
      case Actions.FOREIGN_FOCUS:
        return foreignFocus(state, getPayload(action));
      case Actions.FOREIGN_BLUR:
        return foreignBlur(state, getPayload(action));
      case Actions.PRE_ADD_ENTITY:
        return preAddEntity(transformer, sorter)(state, getPayload(action));
      case Actions.POST_ADD_ENTITY:
        return postAddEntity(state, getPayload(action));
      case Actions.PRE_REMOVE_ENTITY:
        return preRemoveEntity(state, getPayload(action));
      case Actions.POST_REMOVE_ENTITY:
        return postRemoveEntity(transformer, sorter)(state, getPayload(action));
      default:
        throw InvalidAction;
    }
  };
}
