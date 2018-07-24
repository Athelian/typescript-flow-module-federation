// @flow
import * as React from 'react';
import DialogContext from './context';
import { BackdropStyle, DialogStyle } from './style';

type Props = {
  children: ({ openDialog: (component: any, props: Object) => void }) => React.Node,
};

type State = {
  component: React.Node,
  props: Object,
  openDialog: (component: React.Node, props: Object) => void,
  closeDialog: () => void,
};

export default class DialogProvider extends React.Component<Props, State> {
  // declaring no-arrow func to hoist it gives you eslint: don't use bind()
  // eslint-disable-next-line react/sort-comp
  openDialog = (component: React.Node, props: Object = {}) => {
    this.setState({ component, props });
  };

  closeDialog = () => {
    this.setState({ component: null, props: {} });
  };

  state = {
    component: null,
    props: {},
    openDialog: this.openDialog,
    closeDialog: this.closeDialog,
  };

  render() {
    const { children } = this.props;
    return (
      <DialogContext.Provider value={{ ...this.state }}>
        <DialogContext.Consumer>
          {({ component: DialogContent, props, closeDialog, openDialog }) => (
            <React.Fragment>
              {DialogContent && (
                <div className={BackdropStyle} onClick={closeDialog} role="presentation">
                  <div
                    className={DialogStyle}
                    onClick={e => e.stopPropagation()}
                    role="presentation"
                  >
                    <DialogContent {...props} onRequestClose={closeDialog} />
                  </div>
                </div>
              )}
              {children({ openDialog })}
            </React.Fragment>
          )}
        </DialogContext.Consumer>
      </DialogContext.Provider>
    );
  }
}
