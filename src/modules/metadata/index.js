// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import MetadataForm from './index.form';

const MetadataModule = () => (
  <Router>
    <MetadataForm path="/" redirectUrl="/order" />
    <MetadataForm path="/:entityType" />
  </Router>
);

export default MetadataModule;
