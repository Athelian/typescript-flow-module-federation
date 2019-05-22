// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionHeader } from 'components/Form';
import { ShipmentCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import { getByPathWithDefault } from 'utils/fp';
import {
  ShipmentsSectionWrapperStyle,
  ShipmentsSectionBodyStyle,
  EmptyMessageStyle,
} from './style';
import { orderFormShipmentsQuery } from './query';

type Props = {
  entityId: string,
  isLoading: boolean,
};

function ShipmentsSection({ entityId, isLoading }: Props) {
  return (
    <QueryPlaceHolder
      PlaceHolder={ListCardPlaceHolder}
      query={orderFormShipmentsQuery}
      entityId={entityId}
      isLoading={isLoading}
    >
      {({ data }) => {
        const shipments = getByPathWithDefault([], 'order.shipments', data);
        return (
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
                    <ShipmentCard shipment={shipment} key={shipment.id} />
                  ))}
                </div>
              )}
            </div>
          </>
        );
      }}
    </QueryPlaceHolder>
  );
}

export default ShipmentsSection;
