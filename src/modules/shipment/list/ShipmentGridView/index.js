// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import usePermission from 'hooks/usePermission';
import { SHIPMENT_CREATE, SHIPMENT_UPDATE } from 'modules/permission/constants/shipment';
import GridView from 'components/GridView';
import { ShipmentCard, CardAction } from 'components/Cards';
import { ShipmentActivateDialog, ShipmentArchiveDialog } from 'modules/shipment/common/Dialog';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object, hasPermission: (string) => boolean) => React.Node,
};

const defaultRenderItem = (item: Object, hasPermission: string => boolean) => (
  <BooleanValue key={item.id}>
    {({ value: statusDialogIsOpen, set: dialogToggle }) => (
      <>
        {item.archived ? (
          <ShipmentActivateDialog
            onRequestClose={() => dialogToggle(false)}
            isOpen={statusDialogIsOpen}
            shipment={item}
          />
        ) : (
          <ShipmentArchiveDialog
            onRequestClose={() => dialogToggle(false)}
            isOpen={statusDialogIsOpen}
            shipment={item}
          />
        )}
        <ShipmentCard
          shipment={item}
          actions={[
            hasPermission(SHIPMENT_CREATE) && (
              <CardAction
                icon="CLONE"
                onClick={() => navigate(`/shipment/clone/${encodeId(item.id)}`)}
              />
            ),
            hasPermission(SHIPMENT_UPDATE) && (
              <CardAction
                icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                onClick={() => dialogToggle(true)}
              />
            ),
          ].filter(Boolean)}
          showActionsOnHover
          onClick={() => navigate(`/shipment/${encodeId(item.id)}`)}
        />
      </>
    )}
  </BooleanValue>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const ShipmentGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;
  const { hasPermission } = usePermission();
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="860px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Shipments.noItem" defaultMessage="No shipments found" />
      }
    >
      {items.map(item => renderItem(item, hasPermission))}
    </GridView>
  );
};

ShipmentGridView.defaultProps = defaultProps;

export default ShipmentGridView;
