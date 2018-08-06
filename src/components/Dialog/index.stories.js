import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { BooleanValue } from 'react-values';
import Dialog from './index';

storiesOf('Dialog', module).add('normal dialog', () => (
  <BooleanValue>
    {({ value: isOpen, toggle }) => (
      <React.Fragment>
        <button type="button" onClick={toggle}>
          open Dialog
        </button>
        <div id="dialog-root" />
        <Dialog isOpen={isOpen} onRequestClose={toggle} options={{ width: 400 }}>
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <button onClick={toggle} type="button">
              close dialog
            </button>
          </div>
        </Dialog>
      </React.Fragment>
    )}
  </BooleanValue>
));
