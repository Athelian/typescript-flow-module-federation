// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { WarehouseCard } from 'components/Cards';
import { encodeId } from 'utils/id';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

function onClone(warehouseId: string) {
  navigate(`/warehouse/clone/${encodeId(warehouseId)}`);
}

const defaultRenderItem = (item: Object) => (
  <WarehouseCard
    key={item.id}
    warehouse={item}
    onClone={() => onClone(item.id)}
    showActionsOnHover
  />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const WarehouseGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="200px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.warehouse.noItem" defaultMessage="No warehouses found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

WarehouseGridView.defaultProps = defaultProps;

export default WarehouseGridView;
