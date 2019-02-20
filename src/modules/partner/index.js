// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { PARTNER_CREATE, PARTNER_FORM, PARTNER_LIST } from 'modules/permission/constants/partner';
import PartnerListModule from './index.list';
import PartnerFormModule from './index.form';

const PartnerFormModuleWrapper = withNotFound(PartnerFormModule, 'partnerId');
const PartnerFormModuleDetailWrapper = withForbidden(PartnerFormModuleWrapper, PARTNER_FORM);
const PartnerFormModuleCreationWrapper = withForbidden(PartnerFormModuleWrapper, PARTNER_CREATE);
const PartnerModuleListWrapper = withForbidden(PartnerListModule, PARTNER_LIST);

const PartnerApp = () => (
  <Router>
    <PartnerModuleListWrapper path="/" />
    <PartnerFormModuleCreationWrapper path="new" />
    <PartnerFormModuleCreationWrapper path="clone/:partnerId" />
    <PartnerFormModuleDetailWrapper path=":partnerId" />
  </Router>
);

export default PartnerApp;
