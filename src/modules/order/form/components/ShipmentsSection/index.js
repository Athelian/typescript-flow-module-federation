// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ShipmentCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import {
  ShipmentsSectionWrapperStyle,
  ShipmentsSectionBodyStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  shipments: Array<Object>,
};

function ShipmentsSection({ shipments }: Props) {
  return (
    <div className={ShipmentsSectionWrapperStyle}>
      <SectionNavBar>
        <div id="sortsandfilterswip" />
      </SectionNavBar>
      <div className={ShipmentsSectionBodyStyle}>
        {shipments.length === 0 ? (
          <div className={EmptyMessageStyle}>
            <FormattedMessage
              id="modules.order.noShipmentFound"
              defaultMessage="No shipments found"
            />
          </div>
        ) : (
          shipments.map(shipment => <ShipmentCard shipment={shipment} key={shipment.id} />)
        )}
      </div>
    </div>
  );
}

export default ShipmentsSection;
