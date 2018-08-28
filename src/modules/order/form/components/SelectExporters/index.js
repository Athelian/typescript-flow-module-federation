// @flow
import * as React from 'react';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import PartnerGridView from 'modules/partner/list/components/PartnerGridView';
import PartnerCard from 'modules/partner/list/components/PartnerCard';

type Props = {
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const SelectExporters = ({ selected, onSelect }: Props) => (
  <PartnerListProvider>
    {({ loading, data }) => (
      <Layout
        navBar={
          <NavBar>
            <EntityIcon icon="PARTNER" color="BLACK" />
          </NavBar>
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
              onSelect={() => onSelect(item)}
              selectable
              selected={!!selected && !!selected.id && item.group.id === selected.id}
              key={item.id}
            />
          )}
        />
      </Layout>
    )}
  </PartnerListProvider>
);

SelectExporters.defaultProps = defaultProps;

export default SelectExporters;
