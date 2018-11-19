// @flow
import * as React from 'react';

import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';

type OptionalProps = {
  selected: {
    id: string,
  },
};

type Props = OptionalProps & {
  onCancel: Function,
  onSave: Function,
};

const SelectMetadataTemplate = ({ selected, onCancel, onSave }: Props) => (
  <Layout
    navBar={
      <SlideViewNavBar>
        <EntityIcon icon="ORDER_ITEM" color="ORDER_ITEM" />
        <CancelButton onClick={onCancel} />
        <SaveButton
          data-testid="saveButtonOnSelectOrderItem"
          // disabled={isEquals(value, selected)}
          onClick={onSave}
        />
      </SlideViewNavBar>
    }
  >
    {selected.id}
    {/* <OrderGridView
          hasMore={hasMorePage(data)}
          isLoading={loading}
          onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orderItems')}
          items={getByPathWithDefault([], 'orderItems.nodes', data)}
          renderItem={item => (
            <OrderItemCard
              item={item}
              onSelect={() => set(item)}
              selectable
              selected={item.id === value.id}
              key={item.id}
            />
          )}
        /> */}
  </Layout>
);

export default SelectMetadataTemplate;
