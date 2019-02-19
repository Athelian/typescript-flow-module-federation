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
};

export type RenderSelectProps = {
  isOpen: boolean,
  clearSelection: () => void,
  toggle: () => void,
  selectedItem: any,
  getInputProps: Function,
};

export type RenderOptionsProps = {
  highlightedIndex: number,
  selectedItem: any,
  getItemProps: Function,
};

export type SelectInputProps = OptionalProps & {
  name: string,
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  renderSelect: RenderSelectProps => React.Node,
  renderOptions: RenderOptionsProps => React.Node,
};

export const defaultSelectInputProps = {
  value: '',
  readOnly: false,
  align: 'right',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  placeholder: null,
};

export default defaultSelectInputProps;
