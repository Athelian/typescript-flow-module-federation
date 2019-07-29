// @flow
import * as React from 'react';

type OptionalProps = {
  value: any,
  onChange: ?Function,
  onBlur: ?Function,
  onFocus: ?Function,
  readOnly: boolean,
  readOnlyWidth?: string,
  readOnlyHeight?: string,
  align: 'left' | 'right' | 'center',
  placeholder: ?string,
  afterClearSelection: Function,
};

export type RenderSelectProps = {
  isOpen: boolean,
  clearSelection: (cb?: Function) => mixed,
  toggle: () => mixed,
  selectedItem: any,
  getInputProps: Function,
};

export type RenderOptionsProps = {
  highlightedIndex: ?number,
  selectedItem: any,
  getItemProps: Function,
};

export type SelectInputProps = OptionalProps & {
  name: string,
  items: Array<any>,
  itemToString: any => string,
  // TODO: itemToValue was removed from downshift
  itemToValue: any => any,
  renderSelect: RenderSelectProps => React.Node,
  renderOptions: RenderOptionsProps => React.Node,
};

export const defaultSelectInputProps = {
  value: '',
  readOnly: false,
  align: 'left',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  afterClearSelection: () => {},
  placeholder: null,
};

export default defaultSelectInputProps;
