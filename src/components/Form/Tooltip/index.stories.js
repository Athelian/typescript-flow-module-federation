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
      <Tooltip errorMessage="Error aluuuyo" />
    </div>
  ))
  .add('error & info', () => (
    <div style={{ margin: '200px' }}>
      <Tooltip errorMessage="Error aluuuyo" infoMessage="Info msgeeeee" />
    </div>
  ))
  .add('error & changed & info', () => (
    <div style={{ margin: '200px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Tooltip
          errorMessage="Error aluuuyo, please check your chuck and swipe left for you wife"
          changedValues={{ oldValue: 'old', newValue: 'new' }}
          infoMessage="Info msgeeeee"
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
      <Tooltip warningMessage="Warning aluuuyo" />
    </div>
  ))
  .add('warning & info', () => (
    <div style={{ margin: '200px' }}>
      <Tooltip warningMessage="Warning aluuuyo" infoMessage="Info msgeeeee" />
    </div>
  ))
  .add('warning & changed & info', () => (
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
