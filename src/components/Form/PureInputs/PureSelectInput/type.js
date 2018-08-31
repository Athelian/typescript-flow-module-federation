// @flow
import * as React from 'react';
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

type OptionalProps = PureInputProps;

export type PureSelectInputProps = OptionalProps & {
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  renderOptions: ({
    highlightedIndex: number,
    selectedItem: any,
    getItemProps: Function,
  }) => React.Node,
  renderSelect: ({
    isOpen: boolean,
    clearSelection: () => void,
    toggle: () => void,
    selectedItem: any,
    getInputProps: Function,
  }) => React.Node,
};

export type ExternPureSelectInputProps = OptionalProps & {
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
};

export const defaultPureSelectInputProps = {
  ...defaultPureInputProps,
};

export default defaultPureSelectInputProps;
