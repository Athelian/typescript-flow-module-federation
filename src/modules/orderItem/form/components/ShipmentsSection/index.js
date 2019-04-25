// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import FormattedNumber from 'components/FormattedNumber';
import { ShipmentCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { OrderItemShipmentsContainer } from 'modules/orderItem/form/containers';
import {
  ShipmentsSectionWrapperStyle,
  ShipmentsSectionBodyStyle,
  EmptyMessageStyle,
} from './style';

const ShipmentsSection = () => (
  <SectionWrapper id="orderItem_shipmentsSection">
    <Subscribe to={[OrderItemShipmentsContainer]}>
      {({ state: { shipments = [] } }) => (
        <>
          <SectionHeader
            icon="SHIPMENT"
            title={
              <>
                <FormattedMessage id="modules.orderItem.shipments" defaultMessage="SHIPMENTS" /> (
                <FormattedNumber value={shipments.length} />)
              </>
            }
          />
          <div className={ShipmentsSectionWrapperStyle}>
            <SectionNavBar>
              <div id="sortsandfilterswip" />
            </SectionNavBar>
            <div className={ShipmentsSectionBodyStyle}>
              {shipments.length === 0 ? (
                <div className={EmptyMessageStyle}>
                  <FormattedMessage
                    id="modules.orderItem.noShipmentFound"
                    defaultMessage="No shipments found"
                  />
                </div>
              ) : (
                shipments.map(shipment => <ShipmentCard shipment={shipment} key={shipment.id} />)
              )}
            </div>
          </div>
        </>
      )}
    </Subscribe>
  </SectionWrapper>
);

export default ShipmentsSection;
