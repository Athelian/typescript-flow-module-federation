// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import GridView from 'components/GridView';
import { ShipmentCard, CardAction } from 'components/Cards';
import {
  SHIPMENT_CREATE,
  SHIPMENT_UPDATE,
  SHIPMENT_FORM,
} from 'modules/permission/constants/shipment';
import { ShipmentActivateDialog, ShipmentArchiveDialog } from 'modules/shipment/common/Dialog';

type OptionalProps = {
  renderItem: (item: Object) => React.Node,
};

type Props = OptionalProps & {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const defaultRenderItem = item => (
  <PartnerPermissionsWrapper data={item}>
    {permissions => (
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
                permissions.includes(SHIPMENT_CREATE) && (
                  <CardAction
                    icon="CLONE"
                    onClick={() => navigate(`/shipment/clone/${encodeId(item.id)}`)}
                  />
                ),
                permissions.includes(SHIPMENT_UPDATE) && (
                  <CardAction
                    icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                    onClick={() => dialogToggle(true)}
                  />
                ),
              ].filter(Boolean)}
              showActionsOnHover
              onClick={() => {
                if (permissions.includes(SHIPMENT_FORM)) {
                  navigate(`/shipment/${encodeId(item.id)}`);
                }
              }}
            />
          </>
        )}
      </BooleanValue>
    )}
  </PartnerPermissionsWrapper>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const ShipmentGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem } = props;

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
      {items.map(renderItem)}
    </GridView>
  );
};

ShipmentGridView.defaultProps = defaultProps;

export default ShipmentGridView;
