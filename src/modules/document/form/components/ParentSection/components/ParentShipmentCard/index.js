// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { ShipmentCard } from 'components/Cards';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { SHIPMENT_FORM } from 'modules/permission/constants/shipment';

type Props = {
  shipment: Object,
};

const ParentShipmentCard = ({ shipment }: Props) => {
  const hasPermissions = useEntityHasPermissions(shipment);

  return (
    <ShipmentCard
      shipment={shipment}
      onClick={() => {
        if (hasPermissions(SHIPMENT_FORM) && !!shipment?.id) {
          navigate(`/shipment/${encodeId(shipment?.id)}`);
        }
      }}
    />
  );
};

export default ParentShipmentCard;
