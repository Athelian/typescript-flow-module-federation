// @flow
import { type PureInputProps } from 'components/Form/PureInputs/type';
import { defaultPureSelectInputProps } from 'components/Form/PureInputs/PureSelectInput/type';

export type PureSearchSelectInputProps = PureInputProps & {
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  renderSelect: ({
    isOpen: boolean,
    clearSelection: () => void,
    toggle: () => void,
    selectedItem: any,
    value: string,
    handleQueryChange: Function,
    getInputProps: Function,
  }) => React.Node,
  renderOptions: ({
    highlightedIndex: number,
    selectedItem: any,
    getItemProps: Function,
  }) => React.Node,
  onSearch: string => void,
};

export const defaultPureSearchSelectInputProps = {
  ...defaultPureSelectInputProps,
  onSearch: () => {},
};

export default defaultPureSearchSelectInputProps;
