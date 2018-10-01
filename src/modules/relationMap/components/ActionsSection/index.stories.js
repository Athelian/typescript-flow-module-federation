/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { BaseButton } from 'components/Buttons';
import { ActionSection1, ActionSection2 } from './index';

storiesOf('RelationMap/Action', module)
  .add('ActionSection1', () => (
    <ActionSection1 directive="SELECTED" target="BATCHES" targetNo={0}>
      <BaseButton
        icon="CLONE"
        label="CLONE"
        backgroundColor="TEAL"
        hoverBackgroundColor="TEAL_DARK"
        onClick={() => {}}
      />
      <BaseButton
        icon="SPLIT"
        label="SPLIT"
        backgroundColor="TEAL"
        hoverBackgroundColor="TEAL_DARK"
        onClick={() => {}}
      />
      <BaseButton
        icon="EDIT"
        label="EDIT"
        backgroundColor="TEAL"
        hoverBackgroundColor="TEAL_DARK"
        onClick={() => {}}
      />
      <BaseButton
        icon="CONNECT"
        label="CONNECT"
        backgroundColor="TEAL"
        hoverBackgroundColor="TEAL_DARK"
        onClick={() => {}}
      />
    </ActionSection1>
  ))
  .add('ActionSection2', () => <ActionSection2 directive="CONNECT TO" />);
