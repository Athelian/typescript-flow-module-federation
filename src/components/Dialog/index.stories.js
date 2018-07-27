import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import Dialog from './index';

class DialogControler extends React.Component {
  state = {
    isDialogOpen: false,
  };

  open = () => {
    this.setState({ isDialogOpen: true });
  };

  close = () => {
    this.setState({ isDialogOpen: false });
  };

  render() {
    const { isDialogOpen } = this.state;
    return (
      <div>
        <button type="button" onClick={this.open}>
          open Dialog
        </button>

        <Dialog isOpen={isDialogOpen} onRequestClose={this.close} options={{ width: 400 }}>
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <button onClick={this.close} type="button">
              close dialog
            </button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default DialogControler;

storiesOf('Dialog', module).add('normal dialog', () => <DialogControler />);
