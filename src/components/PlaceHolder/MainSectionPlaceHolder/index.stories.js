import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import MainSectionPlaceHolder from './index';

storiesOf('PlaceHolder/MainSectionPlaceHolder', module).add('MainSectionPlaceHolder', () => (
  <MainSectionPlaceHolder>
    <h1>Render content.</h1>
  </MainSectionPlaceHolder>
));
