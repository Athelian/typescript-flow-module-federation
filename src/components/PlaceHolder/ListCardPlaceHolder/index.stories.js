import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import ListCardPlaceHolder from './index';

storiesOf('PlaceHolder/ListCardPlaceHolder', module).add('ListCardPlaceHolder', () => (
  <ListCardPlaceHolder>
    <h1>Render content.</h1>
  </ListCardPlaceHolder>
));
