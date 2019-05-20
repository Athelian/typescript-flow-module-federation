// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
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
  isLoading: boolean,
};

function ShipmentsSection({ entityId, isLoading }: Props) {
  return (
    <ListCardPlaceholder isLoading={isLoading}>
      <Query
        query={orderFormShipmentsQuery}
        variables={{
          id: entityId,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, error }) => {
          if (error) {
            if (error.message && error.message.includes('403')) {
              navigate('/403');
            }

            return error.message;
          }
          if (loading) return <ListCardPlaceholder isLoading>Loading... </ListCardPlaceholder>;

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
      </Query>
    </ListCardPlaceholder>
  );
}

export default ShipmentsSection;
