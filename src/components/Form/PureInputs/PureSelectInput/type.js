// @flow
import * as React from 'react';
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

export type PureSelectInputProps = PureInputProps & {
  items: Array<any>,
  itemToString: any => string,
  itemToValue: any => any,
  renderSelect: ({
    input: React.Node,
    isOpen: boolean,
    clearSelection: () => void,
    toggle: () => void,
    selectedItem: any,
  }) => React.Node,
  renderOption: ({ value: any, onHover: boolean, selected: boolean }) => React.Node,
  styles: { input: any, options: any },
};

export const defaultPureSelectInputProps = {
  ...defaultPureInputProps,
};

export default defaultPureSelectInputProps;
