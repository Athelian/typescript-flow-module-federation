// @flow
import * as React from 'react';
import { type RenderOptionsProps } from 'components/Form/Inputs/SelectInput/type';

type OptionalProps = {
  value: any,
  inputValue: string,
  name: string,
  onChange: ?Function,
  onBlur: ?Function,
  onFocus: ?Function,
  onSearch: string => void,
  afterClearSelection: ?() => void,
};

export type RenderSearchSelectProps = {
  isOpen: boolean,
  clearSelection: () => void,
  toggle: () => void,
  selectedItem: any,
  getInputProps: Function,
  value: string,
  handleQueryChange: Function,
};

export type SearchSelectInputProps = OptionalProps & {
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  renderSelect: RenderSearchSelectProps => React.Node,
  renderOptions: RenderOptionsProps => React.Node,
};

export const defaultSearchSelectInputProps = {
  value: '',
  inputValue: '',
  name: '',
  onChange: null,
  onSearch: () => {},
  afterClearSelection: () => {},
};

export default defaultSearchSelectInputProps;
