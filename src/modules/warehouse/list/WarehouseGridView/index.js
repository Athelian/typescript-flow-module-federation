// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import {
  WAREHOUSE_FORM,
  WAREHOUSE_CREATE,
  WAREHOUSE_UPDATE,
  WAREHOUSE_SET_ARCHIVED,
} from 'modules/permission/constants/warehouse';
import usePermission from 'hooks/usePermission';
import GridView from 'components/GridView';
import { WarehouseCard, CardAction } from 'components/Cards';
import { encodeId } from 'utils/id';
import { BooleanValue } from 'react-values';
import { WarehouseActivateDialog, WarehouseArchiveDialog } from 'modules/warehouse/common/Dialog';

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
  allowChangeStatus,
  currentUserGroupId,
}: {
  item: Object,
  allowViewForm: boolean,
  allowCreate: boolean,
  allowChangeStatus: boolean,
  currentUserGroupId: string,
}) => {
  const allowClone = allowCreate && item.ownedBy && currentUserGroupId === item.ownedBy.id;

  return (
    <BooleanValue key={item.id}>
      {({ value: statusDialogIsOpen, set: dialogToggle }) => (
        <>
          {item.archived ? (
            <WarehouseActivateDialog
              onRequestClose={() => dialogToggle(false)}
              isOpen={statusDialogIsOpen}
              warehouse={item}
            />
          ) : (
            <WarehouseArchiveDialog
              onRequestClose={() => dialogToggle(false)}
              isOpen={statusDialogIsOpen}
              warehouse={item}
            />
          )}
          <WarehouseCard
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
              allowChangeStatus && (
                <CardAction
                  icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                  onClick={() => dialogToggle(true)}
                />
              ),
            ].filter(Boolean)}
          />
        </>
      )}
    </BooleanValue>
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
  const { organization } = useUser();
  const allowViewForm = hasPermission(WAREHOUSE_FORM);
  const allowCreate = hasPermission(WAREHOUSE_CREATE);
  const allowChangeStatus =
    hasPermission(WAREHOUSE_UPDATE) || hasPermission(WAREHOUSE_SET_ARCHIVED);

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
        renderItem({
          item,
          allowViewForm,
          allowCreate,
          allowChangeStatus,
          currentUserGroupId: organization.id,
        })
      )}
    </GridView>
  );
};

WarehouseGridView.defaultProps = defaultProps;

export default WarehouseGridView;
