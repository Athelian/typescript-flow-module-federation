// @flow
import * as React from 'react';
import PreventInitialAnimation from 'components/PreventInitialAnimation';
import DialogContext from './context';
import { BackdropStyle, BackDropFadeOutStyle, DialogStyle, DialogFadeOutStyle } from './style';

type Props = {
  children: ({ openDialog: (component: any, props: Object) => void }) => React.Node,
};

type State = {
  component: React.Node,
  isOpen: boolean,
  props: Object,
};

export default class DialogProvider extends React.Component<Props, State> {
  state = {
    component: null,
    isOpen: false,
    props: {},
  };

  openDialog = (component: React.Node, props: Object = {}) => {
    this.setState({ component, props, isOpen: true });
  };

  closeDialog = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { children } = this.props;

    const contextValue = {
      openDialog: this.openDialog,
      closeDialog: this.closeDialog,
      ...this.state,
    };

    const {
      props: { contentWidth },
    } = this.state;

    return (
      <DialogContext.Provider value={contextValue}>
        <DialogContext.Consumer>
          {({ component: DialogContent, props, closeDialog, openDialog, isOpen }) => (
            <React.Fragment>
              <PreventInitialAnimation>
                <div
                  className={isOpen ? BackdropStyle : BackDropFadeOutStyle}
                  onClick={closeDialog}
                  role="presentation"
                >
                  <div
                    className={
                      isOpen ? DialogStyle(contentWidth) : DialogFadeOutStyle(contentWidth)
                    }
                    onClick={e => e.stopPropagation()}
                    role="presentation"
                  >
                    {DialogContent && <DialogContent {...props} onRequestClose={closeDialog} />}
                  </div>
                </div>
              </PreventInitialAnimation>
              {children({ openDialog })}
            </React.Fragment>
          )}
        </DialogContext.Consumer>
      </DialogContext.Provider>
    );
  }
}
