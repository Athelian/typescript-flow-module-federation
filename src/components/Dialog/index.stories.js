import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import DialogProvider from './index';

/* eslint-disable react/prop-types */
const DialogContent = ({ onRequestClose }) => (
  <div style={{ padding: '50px' }}>
    <button onClick={onRequestClose} type="button">
      close dialog
    </button>
  </div>
);

storiesOf('Dialog', module).add('normal dialog', () => (
  <DialogProvider>
    {({ openDialog }) => (
      <button type="button" onClick={() => openDialog(DialogContent, { contentWidth: 300 })}>
        open Dialog
      </button>
    )}
  </DialogProvider>
));
