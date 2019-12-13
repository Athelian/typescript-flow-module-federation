// @flow

export const Actions = {
  INIT: 'init',
  APPEND: 'append',
  REARRANGE_COLUMNS: 'rearrange_columns',
  CELL_UPDATE: 'cell_update',
  CHANGE_VALUES: 'change_values',
  REPLACE_ITEM: 'replace_item',
  REPLACE_ITEMS: 'replace_items',
  DELETE_ITEM: 'delete_item',
  SET_ERROR: 'set_error',
  CLEAR_ERROR: 'clear_error',
  HOVER: 'hover',
  UNHOVER: 'unhover',
  FOCUS: 'focus',
  FOCUS_UP: 'focus_up',
  FOCUS_DOWN: 'focus_down',
  FOCUS_RIGHT: 'focus_right',
  FOCUS_LEFT: 'focus_left',
  BLUR: 'blur',
  SET_FOREIGN_FOCUSES: 'set_foreign_focuses',
  APPEND_FOREIGN_FOCUSES: 'append_foreign_focuses',
  FOREIGN_FOCUS: 'foreign_focus',
  FOREIGN_BLUR: 'foreign_blur',
  PRE_ADD_ENTITY: 'pre_add_entity',
  POST_ADD_ENTITY: 'post_add_entity',
  PRE_REMOVE_ENTITY: 'pre_remove_entity',
  POST_REMOVE_ENTITY: 'post_remove_entity',
};

export default Actions;
