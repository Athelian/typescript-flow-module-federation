// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { SectionHeader } from 'components/Form';
import { ShipmentCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import ListCardPlaceholder from 'components/PlaceHolder/ListCardPlaceHolder';
import { getByPathWithDefault } from 'utils/fp';
import {
  ShipmentsSectionWrapperStyle,
  ShipmentsSectionBodyStyle,
  EmptyMessageStyle,
} from './style';
import { orderFormShipmentsQuery } from './query';

type Props = {
  entityId: string,
};

function ShipmentsSection({ entityId }: Props) {
  const { data, loading, error, networkStatus } = useQuery(orderFormShipmentsQuery, {
    variables: {
      id: entityId,
    },
  });

  const refetching = networkStatus === 4;

  if (loading && !refetching)
    return (
      <ListCardPlaceholder isLoading>
        <span>Loading...</span>
      </ListCardPlaceholder>
    );

  if (error) return error.message;

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
}

export default ShipmentsSection;
