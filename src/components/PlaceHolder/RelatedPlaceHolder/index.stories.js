import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import RelatedPlaceHolder from './index';

storiesOf('PlaceHolder/RelatedPlaceHolder', module).add('RelatedPlaceHolder', () => (
  <RelatedPlaceHolder>
    <h1>Render content.</h1>
  </RelatedPlaceHolder>
));
