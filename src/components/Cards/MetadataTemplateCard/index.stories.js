import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
import { action } from '@storybook/addon-actions';
import MetadataTemplateCard from './index';

const metadataTemplate = {
  name: 'Order Tempalte B',
  description:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit ...',
  customFields: [
    {
      key: '1',
      value: 1,
      checked: true,
    },
    {
      key: '2',
      value: 2,
      checked: false,
    },
    {
      key: '3',
      value: 3,
      checked: true,
    },
  ],
};

storiesOf('MetadataTemplateCard', module).add('default', () => (
  <IntlProvider locale="en" messages={translationMessages.en}>
    <div style={{ margin: '50px 50px' }}>
      <MetadataTemplateCard metadataTemplate={metadataTemplate} onClick={action('onClick')} />
    </div>
  </IntlProvider>
));
