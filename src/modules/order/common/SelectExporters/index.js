// @flow
import * as React from 'react';
import { ObjectValue } from 'react-values';
import { isEquals } from 'utils/fp';
import { cleanUpData } from 'utils/data';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
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
                <EntityIcon icon="PARTNER" color="PARTNER" />
                <CancelButton onClick={onCancel} />
                <SaveButton
                  disabled={isEquals(value, selected)}
                  onClick={() => onSelect(value)}
                  data-testid="saveButtonOnSelectExporters"
                />
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
                  onSelect={() => set(cleanUpData(item))}
                  selectable
                  selected={value && item.id === value.id}
                  key={item.id}
                  data-testid="partnerCard"
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
