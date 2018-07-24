// @flow
import * as React from 'react';

type DialogType = {
  component: any,
  props: Object,
  openDialog: (component: React.Node, props: Object) => void,
  closeDialog: () => void,
};

const DialogContext = React.createContext(
  ({
    component: null,
    props: {},
    openDialog: () => {},
    closeDialog: () => {},
  }: DialogType)
);

export default DialogContext;
export const DialogConsumer = DialogContext.Consumer;
