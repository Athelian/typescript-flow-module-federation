// @flow
import * as React from 'react';
import { Router, Redirect } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { NAVIGATION_DOCUMENTS_LIST } from 'modules/permission/constants/navigation';
import DocumentListModule from './index.list';
import DocumentFormModule from './index.form';

const DocumentListModuleWrapper = withForbidden(DocumentListModule, NAVIGATION_DOCUMENTS_LIST);

const DocumentApp = () => (
  <Router>
    {/* $FlowFixMe Flow typed is not updated yet */}
    <Redirect path="/" from="/" to="/document/cards" noThrow />
    <DocumentListModuleWrapper path="/cards" />
    <DocumentFormModule path=":documentId" />
  </Router>
);

export default DocumentApp;
