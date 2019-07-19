// @flow
import * as React from 'react';
import type { ShipmentPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { getByPath } from 'utils/fp';
import { encodeId } from 'utils/id';
import { SectionHeader } from 'components/Form';
import { ShipmentCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import {
  ShipmentsSectionWrapperStyle,
  ShipmentsSectionBodyStyle,
  EmptyMessageStyle,
} from './style';

type Props = {|
  isReady: boolean,
  shipments: Array<ShipmentPayload>,
|};

function ShipmentsSection({ isReady, shipments }: Props) {
  return !isReady ? (
    <ListCardPlaceHolder />
  ) : (
    <>
      <SectionHeader
        icon="SHIPMENT"
        title={
          <>
            <FormattedMessage id="modules.Orders.shipments" defaultMessage="SHIPMENTS" /> (
            {shipments.length})
          </>
        }
      />
      <div className={ShipmentsSectionWrapperStyle}>
        <SectionNavBar>
          <div id="sortsandfilterswip" />
        </SectionNavBar>
        {shipments.length === 0 ? (
          <div className={EmptyMessageStyle}>
            <FormattedMessage
              id="modules.Orders.noShipmentFound"
              defaultMessage="No shipments found"
            />
          </div>
        ) : (
          <div className={ShipmentsSectionBodyStyle}>
            {shipments.map(shipment => (
              <ShipmentCard
                shipment={shipment}
                key={getByPath('id', shipment)}
                onClick={() => navigate(`/shipment/${encodeId(getByPath('id', shipment))}`)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ShipmentsSection;
