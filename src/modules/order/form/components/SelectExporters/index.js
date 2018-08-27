// @flow
import * as React from 'react';
import PartnerListProvider from 'providers/PartnerList';
import { EntityIcon } from 'components/NavBar';
import PartnerGridView from 'modules/partner/list/components/PartnerGridView';
import PartnerCard from 'modules/partner/list/components/PartnerCard';
import { SelectedItemStyle } from './style';

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

function SelectExporters({ selected, onSelect }: Props) {
  return (
    <PartnerListProvider>
      {({ loading, data, error }) => (
        <div>
          <EntityIcon icon="PARTNER" color="BLACK" />
          <PartnerGridView
            error={error}
            hasMore={false}
            isLoading={loading}
            onLoadMore={() => {}}
            items={data.filter(partner => partner.types.includes('Exporter'))}
            selected={selected}
            renderItem={item => (
              <div
                key={item.id}
                role="presentation"
                className={SelectedItemStyle(
                  !!selected && !!selected.id && item.id === selected.id
                )}
              >
                <PartnerCard partner={item} onClick={() => onSelect(item)} />
              </div>
            )}
          />
        </div>
      )}
    </PartnerListProvider>
  );
}

SelectExporters.defaultProps = defaultProps;

export default SelectExporters;
