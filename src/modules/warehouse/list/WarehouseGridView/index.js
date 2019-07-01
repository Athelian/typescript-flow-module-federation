// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import { WAREHOUSE_FORM, WAREHOUSE_CREATE } from 'modules/permission/constants/warehouse';
import usePermission from 'hooks/usePermission';
import GridView from 'components/GridView';
import { WarehouseCard, CardAction } from 'components/Cards';
import { encodeId } from 'utils/id';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

const defaultRenderItem = ({
  item,
  allowViewForm,
  allowCreate,
  currentUserGroupId,
}: {
  item: Object,
  allowViewForm: boolean,
  allowCreate: boolean,
  currentUserGroupId: string,
}) => {
  const allowClone = allowCreate && item.ownedBy && currentUserGroupId === item.ownedBy.id;

  return (
    <WarehouseCard
      key={item.id}
      warehouse={item}
      onClick={allowViewForm ? () => navigate(`/warehouse/${encodeId(item.id)}`) : null}
      showActionsOnHover
      actions={[
        allowClone && (
          <CardAction
            icon="CLONE"
            onClick={() => navigate(`/warehouse/clone/${encodeId(item.id)}`)}
          />
        ),
      ].filter(Boolean)}
    />
  );
};

const defaultProps = {
  renderItem: defaultRenderItem,
};

const WarehouseGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props) => {
  const { hasPermission } = usePermission();
  const { group } = useUser();
  const allowViewForm = hasPermission(WAREHOUSE_FORM);
  const allowCreate = hasPermission(WAREHOUSE_CREATE);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.WareHouses.noItem" defaultMessage="No warehouses found" />
      }
    >
      {items.map(item =>
        renderItem({ item, allowViewForm, allowCreate, currentUserGroupId: group.id })
      )}
    </GridView>
  );
};

WarehouseGridView.defaultProps = defaultProps;

export default WarehouseGridView;
