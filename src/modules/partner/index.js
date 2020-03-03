// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { PARTNER_FORM, PARTNER_LIST } from 'modules/permission/constants/partner';
import PartnerListModule from './index.list';
import PartnerFormModule from './index.form';

const PartnerFormModuleWrapper = withForbidden(PartnerFormModule, PARTNER_FORM);
const PartnerModuleListWrapper = withForbidden(PartnerListModule, PARTNER_LIST);

const PartnerApp = () => (
  <Router>
    <PartnerModuleListWrapper path="/" />
    <PartnerFormModuleWrapper path=":partnerId" />
  </Router>
);

export default PartnerApp;
