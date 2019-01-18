// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ShipmentCard } from 'components/Cards';
import { SectionWrapperStyle, ShipmentSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {
  shipment: ?Object,
};

function ShipmentSection({ shipment }: Props) {
  return (
    <div className={SectionWrapperStyle}>
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
  );
}

export default ShipmentSection;
