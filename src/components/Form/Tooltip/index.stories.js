/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Tooltip from './index';

storiesOf('Form/Tooltip', module)
  .add('info only', () => (
    <div style={{ margin: '200px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Tooltip infoMessage="Info msgeeeee" position="top" />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Tooltip infoMessage="Info msgeeeee" position="left" />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Tooltip infoMessage="Info msgeeeee" position="right" />
      </div>

      <Tooltip infoMessage="Info msgeeeee" position="bottom" />
    </div>
  ))
  .add('info & changed', () => (
    <div style={{ margin: '200px' }}>
      <Tooltip changedValues={{ oldValue: 'old', newValue: 'new' }} infoMessage="Info msgeeeee" />
    </div>
  ))
  .add('error only', () => (
    <div style={{ margin: '200px' }}>
      <Tooltip errorMessage="Error aluuuyo" infoMessage="Info msgeeeee" />
    </div>
  ))
  .add('error & changed', () => (
    <div style={{ margin: '200px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Tooltip
          errorMessage="Error aluuuyo"
          changedValues={{ oldValue: 'old', newValue: 'new' }}
          infoMessage="Info msgeeeee"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Tooltip
          errorMessage="Error aluuuyo"
          changedValues={{ oldValue: 'old', newValue: 'new' }}
          infoMessage="Info msgeeeee"
          position="left"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Tooltip
          errorMessage="Error aluuuyo"
          changedValues={{ oldValue: 'old', newValue: 'new' }}
          infoMessage="Info msgeeeee"
          position="right"
        />
      </div>

      <Tooltip
        errorMessage="Error aluuuyo"
        changedValues={{ oldValue: 'old', newValue: 'new' }}
        infoMessage="Info msgeeeee"
        position="bottom"
      />
    </div>
  ))
  .add('warning only', () => (
    <div style={{ margin: '200px' }}>
      <Tooltip warningMessage="Warning aluuuyo" infoMessage="Info msgeeeee" />
    </div>
  ))
  .add('warning & changed', () => (
    <div style={{ margin: '200px' }}>
      <Tooltip
        warningMessage="Warning aluuuyo"
        changedValues={{ oldValue: 'old', newValue: 'new' }}
        infoMessage="Info msgeeeee"
      />
    </div>
  ))
  .add('changed only', () => (
    <div style={{ margin: '200px' }}>
      <Tooltip changedValues={{ oldValue: 'old', newValue: 'new' }} />
    </div>
  ));
