// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { ShipmentCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { ShipmentSectionWrapperStyle, ShipmentSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {
  shipment: ?Object,
};

function ShipmentSection({ shipment }: Props) {
  return (
    <div className={ShipmentSectionWrapperStyle}>
      <SectionNavBar>
        <div id="sortsandfilterswip" />
      </SectionNavBar>
      <div className={ShipmentSectionBodyStyle}>
        {shipment ? (
          <ShipmentCard
            shipment={shipment}
            onClick={() => navigate(`/shipment/${encodeId(shipment.id)}`)}
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
  );
}

export default ShipmentSection;
