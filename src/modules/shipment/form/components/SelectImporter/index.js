// @flow
import * as React from 'react';
import { ObjectValue } from 'react-values';
import { isEquals } from 'utils/fp';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import LoadingIcon from 'components/LoadingIcon';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import { PartnerCard } from 'components/Cards';

type Props = {
  selected: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const SelectImporter = ({ selected, onCancel, onSelect }: Props) => (
  <PartnerListProvider types={['Importer']}>
    {({ loading, data }) => {
      if (loading) return <LoadingIcon />;
      return (
        <ObjectValue defaultValue={selected}>
          {({ value, set }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="PARTNER" color="PARTNER" />
                  <CancelButton disabled={false} onClick={onCancel} />
                  <SaveButton
                    disabled={isEquals(value, selected)}
                    onClick={() => onSelect(value)}
                  />
                </SlideViewNavBar>
              }
            >
              <PartnerGridView
                hasMore={false}
                isLoading={loading}
                onLoadMore={() => {}}
                items={data.filter(partner => partner.types.includes('Importer'))}
                renderItem={item => (
                  <PartnerCard
                    selectable
                    partner={item}
                    key={item.id}
                    onSelect={() => set(item)}
                    selected={item && value && item.id === value.id}
                  />
                )}
              />
            </Layout>
          )}
        </ObjectValue>
      );
    }}
  </PartnerListProvider>
);

export default SelectImporter;
