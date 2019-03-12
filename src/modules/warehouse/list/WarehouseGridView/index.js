// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { WAREHOUSE_CREATE } from 'modules/permission/constants/warehouse';
import usePermission from 'hooks/usePermission';
import GridView from 'components/GridView';
import { WarehouseCard } from 'components/Cards';
import { encodeId } from 'utils/id';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

const defaultRenderItem = (item: Object, allowCreate: boolean) => (
  <WarehouseCard
    key={item.id}
    warehouse={item}
    onClick={() => navigate(`/warehouse/${encodeId(item.id)}`)}
    onClone={() => navigate(`/warehouse/clone/${encodeId(item.id)}`)}
    showActionsOnHover
    readOnly={!allowCreate}
  />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const WarehouseGridView = (props: Props) => {
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(WAREHOUSE_CREATE);
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="200px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.WareHouses.noItem" defaultMessage="No warehouses found" />
      }
    >
      {items.map(item => renderItem(item, allowCreate))}
    </GridView>
  );
};

WarehouseGridView.defaultProps = defaultProps;

export default WarehouseGridView;
