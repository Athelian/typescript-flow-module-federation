// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ShipmentCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { ShipmentSectionWrapperStyle, ShipmentSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {
  shipment: ?Object,
};

function ShipmentSection({ shipment }: Props) {
  return (
    <SectionWrapper id="batch_shipmentSection">
      <SectionHeader
        icon="SHIPMENT"
        title={<FormattedMessage id="modules.Batches.shipment" defaultMessage="SHIPMENT" />}
      />
      <div className={ShipmentSectionWrapperStyle}>
        <SectionNavBar>
          <div id="sortsandfilterswip" />
        </SectionNavBar>
        <div className={ShipmentSectionBodyStyle}>
          {shipment ? (
            <ShipmentCard shipment={shipment} />
          ) : (
            <div className={EmptyMessageStyle}>
              <FormattedMessage
                id="modules.Batches.noShipmentFound"
                defaultMessage="No shipment found"
              />
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

export default ShipmentSection;
