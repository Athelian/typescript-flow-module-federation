/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ApproveRejectMenu } from 'components/Form';

storiesOf('Form/Inputs/Approval Reject Menu', module).add('Approval Reject Menu', () => (
  <div style={{ background: '#ccc', padding: '10px' }}>
    <ApproveRejectMenu />
  </div>
));
