/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';
import { action } from '@storybook/addon-actions';
import Action from './index';

const ContainerStyle = css`
  position: relative;

  width: 200px;
  height: 50px;

  border: 2px solid #fbaa1d;
  border-radius: 5px;
`;

storiesOf('Cargo Section/Action', module)
  .add('show action', () => (
    <div className={ContainerStyle}>
      <div>XXXXXXXXXXXXXXXXX</div>
      <Action onClick={action('onclick')} message="test" />
    </div>
  ))
  .add('disabled', () => (
    <div className={ContainerStyle}>
      <div>XXXXXXXXXXXXXXXXX</div>
      <Action onClick={action('onclick')} message="test" disabled />
    </div>
  ));
