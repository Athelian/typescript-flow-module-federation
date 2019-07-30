/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import RelateEntity from './index';

storiesOf('RelateEntity', module)
  .add('with order info', () => <RelateEntity entity="ORDER" value="this is order info" />)
  .add('with order info and navigable', () => (
    <RelateEntity link="http://zenport.io" entity="ORDER" value="this is order info" />
  ))
  .add('with blackout', () => <RelateEntity blackout entity="ORDER" value="this is order info" />);
