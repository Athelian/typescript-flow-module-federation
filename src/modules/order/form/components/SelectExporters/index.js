// @flow
import * as React from 'react';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/NavButtons';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import { PartnerCard } from 'components/Cards';

type Props = {
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const SelectExporters = ({ selected, onCancel, onSelect }: Props) => (
  <PartnerListProvider types={['Exporter']}>
    {({ loading, data }) => (
      <ObjectValue defaultValue={selected}>
        {({ value, set }) => (
          <Layout
            navBar={
              <SlideViewNavBar>
                <EntityIcon icon="PARTNER" color="BLACK" />
                <CancelButton disabled={false} onClick={onCancel}>
                  Cancel
                </CancelButton>
                <SaveButton disabled={isEquals(value, selected)} onClick={() => onSelect(value)}>
                  Save
                </SaveButton>
              </SlideViewNavBar>
            }
          >
            <PartnerGridView
              hasMore={false}
              isLoading={loading}
              onLoadMore={() => {}}
              items={data.filter(partner => partner.types.includes('Exporter'))}
              renderItem={item => (
                <PartnerCard
                  partner={item}
                  onSelect={() =>
                    set({
                      id: item.group.id,
                      name: item.name || item.group.name,
                    })
                  }
                  selectable
                  selected={getByPathWithDefault('', 'group.id', item) === value.id}
                  key={item.id}
                />
              )}
            />
          </Layout>
        )}
      </ObjectValue>
    )}
  </PartnerListProvider>
);

SelectExporters.defaultProps = defaultProps;

export default SelectExporters;
