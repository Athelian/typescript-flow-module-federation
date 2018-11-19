import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import CustomFieldsTemplateForm from 'modules/metadata/components/CustomFieldsTemplateForm';

import FormHeader from '../FormHeader';
import CustomFieldsTemplateGridView from '../CustomFieldsTemplateGridView';

import { CustomFieldsEditFormWrapperStyle, CustomFieldsFormHeaderStyle } from './style';

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
    <BooleanValue>
      {({ value: isOpen, set: toggle }) => (
        <>
          <div className={CustomFieldsFormHeaderStyle}>
            <FormHeader
              name={<FormattedMessage id="modules.metadata.templates" defaultMessage="TEMPLATES" />}
            >
              <NewButton onClick={() => toggle(true)} />
            </FormHeader>
          </div>
          <div className={CustomFieldsEditFormWrapperStyle}>
            <CustomFieldsTemplateGridView
              items={dummyCustomFieldsTemplates}
              onLoadMore={() => {}}
              hashMore={false}
              isLoading={false}
            />
          </div>
          <SlideView
            isOpen={isOpen}
            onRequestClose={() => toggle(false)}
            options={{ width: '1030px' }}
          >
            <CustomFieldsTemplateForm
              template={{
                name: 'template name',
                description: 'template description',
                metadata: [
                  { checked: false, key: 'custom fields 1', value: 'Input' },
                  { checked: true, key: 'custom fields 2', value: 'Input' },
                  { checked: false, key: 'custom fields 3', value: 'Input' },
                  { checked: false, key: 'custom fields 4', value: 'Input' },
                ],
              }}
              onSave={() => toggle(false)}
              onCancel={() => toggle(false)}
            />
          </SlideView>
        </>
      )}
    </BooleanValue>
  </div>
);

export default CustomFieldTemplateList;
