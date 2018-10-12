import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import Dialog from 'components/Dialog';
import SlideView from './index';

class SlideViewControler extends React.Component {
  state = {
    isSlideViewOpen: false,
    isDialogOpen: false,
  };

  open = () => {
    this.setState({ isSlideViewOpen: true });
  };

  openDialog = () => {
    this.setState({ isDialogOpen: true });
  };

  closeDialog = () => {
    this.setState({ isDialogOpen: false });
  };

  close = () => {
    this.setState({ isSlideViewOpen: false });
  };

  render() {
    const { isSlideViewOpen, isDialogOpen } = this.state;
    return (
      <div>
        <Dialog isOpen={isDialogOpen} onRequestClose={this.closeDialog} options={{ width: 400 }}>
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <button onClick={this.closeDialog} type="button">
              close dialog
            </button>
          </div>
        </Dialog>

        <button type="button" onClick={this.open}>
          open SlideView
        </button>
        <div id="dialog-root" />
        <SlideView
          rootElementId="root"
          isOpen={isSlideViewOpen}
          onRequestClose={this.close}
          options={{ width: 400 }}
        >
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <button onClick={this.close} type="button">
              close SlideView
            </button>
            <button type="button" onClick={this.openDialog}>
              open Dialog
            </button>
          </div>
        </SlideView>
      </div>
    );
  }
}

export default SlideViewControler;

storiesOf('SlideView', module).add('normal SlideView', () => <SlideViewControler />);
