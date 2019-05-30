// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { ShipmentCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { HIDE, NAVIGABLE, type ShipmentConfigType } from 'modules/batch/form';
import { ShipmentSectionWrapperStyle, ShipmentSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {
  shipment: ?Object,
  shipmentConfig: ShipmentConfigType,
};

function ShipmentSection({ shipment, shipmentConfig }: Props) {
  if (shipmentConfig === HIDE) {
    return null;
  }

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
            <ShipmentCard
              shipment={shipment}
              onClick={() => {
                if (shipmentConfig === NAVIGABLE) {
                  navigate(`/shipment/${encodeId(shipment.id)}`);
                }
              }}
            />
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
