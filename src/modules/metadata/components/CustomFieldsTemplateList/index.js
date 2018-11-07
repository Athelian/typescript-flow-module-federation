import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { NewButton } from 'components/Buttons';

import FormHeader from '../FormHeader';
import CustomFieldsTemplateGridView from '../CustomFieldsTemplateGridView';
import { CustomFieldsEditFormWrapperStyle } from './style';

const dummyCustomFieldsTemplates = [
  {
    id: 1,
    name: 'Order Template A',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit ...',
    customFields: [
      {
        key: 'custom field 1',
        value: 1,
        checked: true,
      },
      {
        key: 'custom field 2',
        value: 2,
        checked: false,
      },
      {
        key: 'custom field 3',
        value: 3,
        checked: true,
      },
      {
        key: 'custom field 4',
        value: 4,
        checked: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Order Template A',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit ...',
    customFields: [
      {
        key: 'custom field 1',
        value: 1,
        checked: true,
      },
      {
        key: 'custom field 2',
        value: 2,
        checked: false,
      },
      {
        key: 'custom field 3',
        value: 3,
        checked: true,
      },
      {
        key: 'custom field 4',
        value: 4,
        checked: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Order Template A',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit ...',
    customFields: [
      {
        key: 'custom field 1',
        value: 1,
        checked: true,
      },
      {
        key: 'custom field 2',
        value: 2,
        checked: false,
      },
      {
        key: 'custom field 3',
        value: 3,
        checked: true,
      },
      {
        key: 'custom field 4',
        value: 4,
        checked: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Order Template A',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit ...',
    customFields: [
      {
        key: 'custom field 1',
        value: 1,
        checked: true,
      },
      {
        key: 'custom field 2',
        value: 2,
        checked: false,
      },
      {
        key: 'custom field 3',
        value: 3,
        checked: true,
      },
      {
        key: 'custom field 4',
        value: 4,
        checked: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Order Template A',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit ...',
    customFields: [
      {
        key: 'custom field 1',
        value: 1,
        checked: true,
      },
      {
        key: 'custom field 2',
        value: 2,
        checked: false,
      },
      {
        key: 'custom field 3',
        value: 3,
        checked: true,
      },
      {
        key: 'custom field 4',
        value: 4,
        checked: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Order Template A',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Lorem ipsum dolor sit ...',
    customFields: [
      {
        key: 'custom field 1',
        value: 1,
        checked: true,
      },
      {
        key: 'custom field 2',
        value: 2,
        checked: false,
      },
      {
        key: 'custom field 3',
        value: 3,
        checked: true,
      },
      {
        key: 'custom field 4',
        value: 4,
        checked: false,
      },
    ],
  },
];

const CustomFieldTemplateList = () => (
  <div>
    <FormHeader
      name={<FormattedMessage id="modules.metadata.templates" defaultMessage="TEMPLATES" />}
    >
      <NewButton onClick={() => {}} />
    </FormHeader>
    <div className={CustomFieldsEditFormWrapperStyle}>
      <CustomFieldsTemplateGridView
        items={dummyCustomFieldsTemplates}
        onLoadMore={() => {}}
        hashMore={false}
        isLoading={false}
      />
    </div>
  </div>
);

export default CustomFieldTemplateList;
