// @flow
import * as React from 'react';
import { ArrayValue } from 'react-values';
import { isEquals } from 'utils/fp';
import PartnerListProvider from 'providers/PartnerList';
import Layout from 'components/Layout';
import { SectionNavBar as NavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/NavButtons';
import PartnerGridView from 'modules/partner/list/PartnerGridView';
import { PartnerCard } from 'components/Cards';

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
  console.warn(selected, items);
  if (selected) {
    const itemIds = selected.map(item => item.id);
    return items.filter(item => itemIds.includes(item.group.id));
  }
  return [];
};

const SelectForwarders = ({ selected, onCancel, onSelect }: Props) => (
  <PartnerListProvider types={['Forwarder']}>
    {({ loading, data }) => (
      <ArrayValue defaultValue={selectedItems(selected, data)}>
        {({ value: values, push, set }) => (
          <Layout
            navBar={
              <NavBar>
                <EntityIcon icon="PARTNER" color="BLACK" />
                <h3>
                  {values.length}/{MAX_SELECTIONS}
                </h3>
                <CancelButton disabled={false} onClick={onCancel}>
                  Cancel
                </CancelButton>
                <SaveButton disabled={isEquals(values, selected)} onClick={() => onSelect(values)}>
                  Save
                </SaveButton>
              </NavBar>
            }
          >
            <PartnerGridView
              hasMore={false}
              isLoading={loading}
              onLoadMore={() => {}}
              items={data.filter(partner => partner.types.includes('Forwarder'))}
              renderItem={item => (
                <PartnerCard
                  partner={item}
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
    )}
  </PartnerListProvider>
);

SelectForwarders.defaultProps = defaultProps;

export default SelectForwarders;
