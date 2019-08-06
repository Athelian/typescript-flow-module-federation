// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import DocumentListModule from './index.list';

const DocumentApp = () => (
  <Router>
    <DocumentListModule path="/" />
  </Router>
);

export default DocumentApp;
