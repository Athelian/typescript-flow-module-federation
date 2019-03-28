/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { IntlProvider } from 'react-intl';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { ApproveRejectMenu } from 'components/Form';

storiesOf('Form/Inputs/Approval Reject Menu', module).add('Approval Reject Menu', () => (
  <StoryBookWrapper>
    <IntlProvider>
      <div style={{ background: '#ccc', padding: '10px' }}>
        <ApproveRejectMenu />
      </div>
    </IntlProvider>
  </StoryBookWrapper>
));
