import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import DocumentPlaceHolder from './index';

storiesOf('PlaceHolder/DocumentPlaceHolder', module).add('DocumentPlaceHolder', () => (
  <DocumentPlaceHolder>
    <h1>Render content.</h1>
  </DocumentPlaceHolder>
));
