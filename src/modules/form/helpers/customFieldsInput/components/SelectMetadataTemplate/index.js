// @flow
import * as React from 'react';
import { ObjectValue } from 'react-values';
import { isEquals } from 'utils/fp';
import { MetadataTemplateCard } from 'components/Cards';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import CustomFieldsTemplateGridView from 'modules/metadata/components/CustomFieldsTemplateGridView';

type OptionalProps = {
  selected: {
    id: string,
  },
};

type Props = OptionalProps & {
  onCancel: Function,
  onSave: Function,
};

const dummyData = [
  {
    id: '1',
    name: 'METADATA TEMPLATE 1',
    memo: 'SOME MEMO',
    fieldDefinitions: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'id4' }, { id: 'id5' }],
  },
  {
    id: '2',
    name: 'METADATA TEMPLATE 2',
    memo: 'SOME MEMO',
    fieldDefinitions: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'id4' }, { id: 'id5' }],
  },
  {
    id: '3',
    name: 'METADATA TEMPLATE 3',
    memo: 'SOME MEMO',
    fieldDefinitions: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'id4' }, { id: 'id5' }],
  },
  {
    id: '4',
    name: 'METADATA TEMPLATE 4',
    memo: 'SOME MEMO',
    fieldDefinitions: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'id4' }, { id: 'id5' }],
  },
];

const SelectMetadataTemplate = ({ selected, onCancel, onSave }: Props) => (
  <ObjectValue defaultValue={selected}>
    {({ value, set }) => (
      <Layout
        navBar={
          <SlideViewNavBar>
            <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" />
            <CancelButton onClick={onCancel} />
            <SaveButton
              data-testid="saveButtonOnSelectOrderItem"
              disabled={isEquals(value, selected)}
              onClick={() => onSave(value)}
            />
          </SlideViewNavBar>
        }
      >
        <CustomFieldsTemplateGridView
          items={dummyData}
          onLoadMore={() => {}}
          hasMore={false}
          isLoading={false}
          renderItem={item => (
            <MetadataTemplateCard
              metadataTemplate={item}
              onSelect={() => set(item)}
              selectable
              selected={item.id === value.id}
              key={item.id}
            />
          )}
        />
      </Layout>
    )}
  </ObjectValue>
);

export default SelectMetadataTemplate;
