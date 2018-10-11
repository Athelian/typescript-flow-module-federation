// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import GridView from 'components/GridView';
import { ShipmentCard, CardAction } from 'components/Cards';
import { ShipmentActivateDialog, ShipmentArchiveDialog } from 'modules/shipment/common/Dialog';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => (
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
            <CardAction
              icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
              onClick={() => dialogToggle(true)}
            />,
          ]}
          showActionsOnHover
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

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="860px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.shipment.noItem" defaultMessage="No shipments found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

ShipmentGridView.defaultProps = defaultProps;

export default ShipmentGridView;
