// @flow
import * as React from 'react';
import DialogContext from './context';
import {
  HiddenStyle,
  BackdropStyle,
  BackDropFadeOutStyle,
  DialogStyle,
  DialogFadeOutStyle,
} from './style';

type Props = {
  children: ({ openDialog: (component: any, props: Object) => void }) => React.Node,
};

type State = {
  component: React.Node,
  props: Object,
  openDialog: (component: React.Node, props: Object) => void,
  closeDialog: () => void,
  shouldApplyAnimation: boolean,
};

export default class DialogProvider extends React.Component<Props, State> {
  // declaring no-arrow func to hoist it gives you eslint: don't use bind()
  // eslint-disable-next-line react/sort-comp
  openDialog = (component: React.Node, props: Object = {}) => {
    this.setState({ component, props });
  };

  closeDialog = () => {
    this.setState({ component: null });
  };

  state = {
    component: null,
    props: {},
    openDialog: this.openDialog,
    closeDialog: this.closeDialog,
    shouldApplyAnimation: false,
  };

  componentDidUpdate() {
    const { shouldApplyAnimation } = this.state;
    if (shouldApplyAnimation) return;
    setTimeout(() => this.setState({ shouldApplyAnimation: true }), 1);
  }

  animationStyle = () => {
    const { shouldApplyAnimation, component } = this.state;
    if (!shouldApplyAnimation) return HiddenStyle;
    return component ? BackdropStyle : BackDropFadeOutStyle;
  };

  dialogAnimationStyle = () => {
    const {
      shouldApplyAnimation,
      component,
      props: { contentWidth },
    } = this.state;
    if (!shouldApplyAnimation) return HiddenStyle;
    return component ? DialogStyle(contentWidth) : DialogFadeOutStyle(contentWidth);
  };

  render() {
    const { children } = this.props;
    const { shouldApplyAnimation, ...contextValue } = this.state;
    return (
      <DialogContext.Provider value={{ ...contextValue }}>
        <DialogContext.Consumer>
          {({ component: DialogContent, props, closeDialog, openDialog }) => (
            <React.Fragment>
              <div className={this.animationStyle()} onClick={closeDialog} role="presentation">
                <div
                  className={this.dialogAnimationStyle()}
                  onClick={e => e.stopPropagation()}
                  role="presentation"
                >
                  {DialogContent && <DialogContent {...props} onRequestClose={closeDialog} />}
                </div>
              </div>
              {children({ openDialog })}
            </React.Fragment>
          )}
        </DialogContext.Consumer>
      </DialogContext.Provider>
    );
  }
}
