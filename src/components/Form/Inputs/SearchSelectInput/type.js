// @flow
import { type RenderOptionsProps } from 'components/Form/Inputs/SelectInput/type';

type OptionalProps = {
  value: any,
  name: string,
  onChange: ?Function,
  onBlur: ?Function,
  onSearch: string => void,
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
  name: '',
  onChange: null,
  onBlur: null,
  onSearch: () => {},
};

export default defaultSearchSelectInputProps;
