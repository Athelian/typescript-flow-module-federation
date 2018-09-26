// @flow
import * as React from 'react';
import { ArrayValue } from 'react-values';
import { isEquals } from 'utils/fp';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import LoadingIcon from 'components/LoadingIcon';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import { ShipmentForwarderCard } from 'components/Cards';

type Props = {
  selected?: ?Array<{
    id: string,
    name: string,
  }>,
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  selected: [],
};

const MAX_SELECTIONS = 4;

function onSelectForwarders({
  selected,
  item,
  push,
  set,
}: {
  selected: Array<Object>,
  item: Object,
  push: Function,
  set: Function,
}) {
  if (!selected.includes(item)) {
    if (selected.length < MAX_SELECTIONS) push(item);
  } else {
    set(selected.filter((orderItem: Object) => orderItem.id !== item.id));
  }
}

const selectedItems = (selected: ?Array<{ id: string, name: string }>, items: Array<Object>) => {
  if (selected) {
    const itemIds = selected.map(item => item.id);
    return items.filter(item => itemIds.includes(item.group.id));
  }
  return [];
};

const SelectForwarders = ({ selected, onCancel, onSelect }: Props) => (
  <PartnerListProvider types={['Forwarder']}>
    {({ loading, data }) => {
      if (loading) return <LoadingIcon />;
      return (
        <ArrayValue defaultValue={selectedItems(selected, data)}>
          {({ value: values, push, set }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="PARTNER" color="BLACK" />
                  <h3>
                    {values.length}/{MAX_SELECTIONS}
                  </h3>
                  <CancelButton disabled={false} onClick={onCancel} />
                  <SaveButton
                    disabled={isEquals(values, selected)}
                    onClick={() => onSelect(values)}
                  />
                </SlideViewNavBar>
              }
            >
              <PartnerGridView
                hasMore={false}
                isLoading={loading}
                onLoadMore={() => {}}
                items={data.filter(partner => partner.types.includes('Forwarder'))}
                renderItem={item => (
                  <ShipmentForwarderCard
                    forwarder={{
                      id: item.group.id,
                      name: item.name || item.group.name,
                    }}
                    onSelect={() => onSelectForwarders({ selected: values, item, push, set })}
                    selectable
                    selected={values.includes(item)}
                    key={item.id}
                  />
                )}
              />
            </Layout>
          )}
        </ArrayValue>
      );
    }}
  </PartnerListProvider>
);

SelectForwarders.defaultProps = defaultProps;

export default SelectForwarders;
