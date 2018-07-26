import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import { storiesOf } from '@storybook/react';
import DialogProvider from './index';

const NestedDialog = ({ onRequestClose }) => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <button onClick={onRequestClose} type="button">
      close dialog
    </button>
  </div>
);

const DialogContent = ({ onRequestClose, openDialog }) => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <button onClick={onRequestClose} type="button">
      close dialog
    </button>
    <div style={{ marginTop: '16px' }}>
      <button onClick={() => openDialog(NestedDialog, {})} type="button">
        Open nested dialog
      </button>
      <div>which just changes content.</div>
    </div>
  </div>
);

storiesOf('Dialog', module).add('normal dialog', () => (
  <DialogProvider>
    {({ openDialog }) => (
      <button type="button" onClick={() => openDialog(DialogContent, { width: 300 })}>
        open Dialog
      </button>
    )}
  </DialogProvider>
));
