// @flow
import * as React from 'react';
import { UserConsumer } from 'modules/user';
import { EntityIcon } from 'components/NavBar';
import PartnerGridView from 'modules/partner/list/components/PartnerGridView';
import PartnerCard from 'modules/partner/list/components/PartnerCard';
import { getByPathWithDefault } from 'utils/fp';
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
    <UserConsumer>
      {({ user }) => (
        <div>
          <EntityIcon icon="PARTNER" color="BLACK" />
          <PartnerGridView
            hasMore={false}
            isLoading={false}
            onLoadMore={() => {}}
            items={getByPathWithDefault([], 'group.partners.nodes', user).filter(
              item => item.type === 'Exporter'
            )}
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
    </UserConsumer>
  );
}

SelectExporters.defaultProps = defaultProps;

export default SelectExporters;
