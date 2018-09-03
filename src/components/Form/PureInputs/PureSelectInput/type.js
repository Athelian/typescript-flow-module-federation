// @flow
import * as React from 'react';

type OptionalProps = {
  value: any,
  onChange: ?Function,
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

export type PureSelectInputProps = OptionalProps & {
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  renderSelect: RenderSelectProps => React.Node,
  renderOptions: RenderOptionsProps => React.Node,
};

export const defaultPureSelectInputProps = {
  value: '',
  onChange: null,
};

export default defaultPureSelectInputProps;
