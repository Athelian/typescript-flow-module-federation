// @flow
import * as React from 'react';

type OptionalProps = {
  value: any,
  inputValue: string,
  onChange: ?Function,
  onBlur: ?Function,
  onFocus: ?Function,
  onSearch: string => void,
  afterClearSelection: () => void,
  id?: string,
  readOnly: boolean,
  readOnlyWidth?: string,
  readOnlyHeight?: string,
  align: 'left' | 'right' | 'center',
  hideClearButton: boolean,
  placeholder: ?string,
};

export type RenderSearchSelectProps = {
  isOpen: boolean,
  clearSelection: (cb?: Function) => mixed,
  toggle: () => mixed,
  selectedItem: any,
  getInputProps: Function,
  value: string,
  handleQueryChange: Function,
};

export type RenderOptionsProps = {
  highlightedIndex: ?number,
  selectedItem: any,
  getItemProps: Function,
};

export type SearchSelectInputProps = OptionalProps & {
  name: string,
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  renderSelect: RenderSearchSelectProps => React.Node,
  renderOptions: RenderOptionsProps => React.Node,
};

export const defaultSearchSelectInputProps = {
  value: '',
  inputValue: '',
  readOnly: false,
  align: 'left',
  onChange: null,
  onSearch: () => {},
  afterClearSelection: () => {},
  hideClearButton: false,
  placeholder: null,
};

export default defaultSearchSelectInputProps;
