// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Query } from 'react-apollo';
import { injectIntl, FormattedMessage } from 'react-intl';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import { Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import { ShipmentListBodyStyle } from 'modules/relationMap/orderFocused/style';
import { shipmentListQuery } from 'modules/relationMapBeta/order/query';
import { hasMoreItems } from 'modules/relationMapBeta/order/helpers';
import { useFilter } from 'modules/relationMapBeta/hooks';
import Shipment from '../Shipment';

type Props = {
  onCountShipment: number => any,
};

function ShipmentList({ onCountShipment }: Props) {
  const { queryVariables } = useFilter({
    page: 1,
    perPage: 10,
    filter: {
      archived: false,
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
  });
  return (
    <Query
      query={shipmentListQuery}
      variables={queryVariables}
      onCompleted={result => onCountShipment(result.shipments.nodes.length)}
      fetchPolicy="network-only"
    >
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        return (
          <>
            {loading ? (
              <LoadingIcon />
            ) : (
              <InfiniteScroll
                className={ShipmentListBodyStyle}
                loadMore={() => loadMore({ fetchMore, data }, queryVariables, 'shipments')}
                hasMore={hasMoreItems(data, 'shipments')}
                loader={<LoadingIcon key="loadingShipment" />}
                useWindow={false}
                threshold={500}
              >
                {getByPathWithDefault([], 'shipments.nodes', data).map(shipment => (
                  <Shipment key={shipment.id} {...shipment} />
                ))}
                {Object.entries(getByPathWithDefault([], 'shipments.nodes', data)).length === 0 && (
                  <Display>
                    <FormattedMessage
                      id="modules.Shipments.noItem"
                      defaultMessage="No shipments found"
                    />
                  </Display>
                )}
              </InfiniteScroll>
            )}
          </>
        );
      }}
    </Query>
  );
}

export default injectIntl(ShipmentList);
