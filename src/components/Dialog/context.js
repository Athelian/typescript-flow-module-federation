// @flow
import * as React from 'react';

type DialogType = {
  component: any,
  isOpen: boolean,
  props: Object,
  openDialog: (component: React.Node, props: Object) => void,
  closeDialog: () => void,
};

const DialogContext = React.createContext(
  ({
    component: null,
    isOpen: false,
    props: {},
    openDialog: () => {},
    closeDialog: () => {},
  }: DialogType)
);

export default DialogContext;
