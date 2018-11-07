// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import MetadataList from './index.list';

const MetadataModule = () => (
  <Router>
    <MetadataList path="/" />
  </Router>
);

export default MetadataModule;
