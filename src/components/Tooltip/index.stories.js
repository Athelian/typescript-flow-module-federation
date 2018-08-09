import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';

import Tooltip, { TooltipMessage } from './index';

const ContainerStyle = css`
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 250px;
`;

storiesOf('Tooltip', module)
  .add('info', () => (
    <div className={ContainerStyle}>
      <Tooltip type="info" title="Plain text message">
        <span>hover me</span>
      </Tooltip>
    </div>
  ))
  .add('edited', () => (
    <div className={ContainerStyle}>
      <Tooltip type="edited" title="Plain text message">
        <span>hover me</span>
      </Tooltip>
    </div>
  ))
  .add('warning', () => (
    <div className={ContainerStyle}>
      <Tooltip type="warning" title="Plain text message">
        <span>hover me</span>
      </Tooltip>
    </div>
  ))
  .add('error', () => (
    <div className={ContainerStyle}>
      <Tooltip type="error" title="Plain text message">
        <span>hover me</span>
      </Tooltip>
    </div>
  ))
  .add('edited with tooltip message', () => (
    <div className={ContainerStyle}>
      <Tooltip
        type="edited"
        title={
          <TooltipMessage
            confirmMessage="Are you sure to insert a negative value?"
            oldValue="5,000"
            newValue="-500"
            description="Max character: 18"
          />
        }
      >
        <span>hover me</span>
      </Tooltip>
    </div>
  ))
  .add('edited with tooltip message only old/new value', () => (
    <div className={ContainerStyle}>
      <Tooltip type="edited" title={<TooltipMessage oldValue="5,000" newValue="-500" />}>
        <span>hover me</span>
      </Tooltip>
    </div>
  ))
  .add('edited with tooltip message old/new value + description', () => (
    <div className={ContainerStyle}>
      <Tooltip
        type="edited"
        title={<TooltipMessage oldValue="5,000" newValue="-500" description="Max character: 18" />}
      >
        <span>hover me</span>
      </Tooltip>
    </div>
  ));
