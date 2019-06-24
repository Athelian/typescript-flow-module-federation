// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { injectIntl, FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroller';
import loadMore from 'utils/loadMore';
import { getByPathWithDefault } from 'utils/fp';
import scrollIntoView from 'utils/scrollIntoView';
import { Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import ActionDispatch from 'modules/relationMap/order/provider';
import { ShipmentListBodyStyle, ItemWrapperStyle } from 'modules/relationMap/order/style';
import { shipmentListQuery, shipmentDetailQuery } from 'modules/relationMap/order/query';
import { hasMoreItems } from 'modules/relationMap/order/helpers';
import { SHIPMENT } from 'constants/keywords';
import { selectors } from 'modules/relationMap/order/store';
import Shipment from '../Shipment';

type Props = {
  onCountShipment: (Array<Object>) => any,
  highLightEntities: Array<string>,
  queryVariables: Object,
};

function ShipmentList({ onCountShipment, highLightEntities, queryVariables }: Props) {
  const context = React.useContext(ActionDispatch);
  const { state } = context;
  const { highlight } = state;
  const uiSelectors = selectors(state);

  return (
    <Query
      query={shipmentListQuery}
      variables={queryVariables}
      onCompleted={result => onCountShipment(result.shipments.nodes)}
      fetchPolicy="network-only"
    >
      {({ loading, data, fetchMore, error, refetch, client }) => {
        if (error) {
          return error.message;
        }

        if (loading) {
          return <LoadingIcon />;
        }

        if (state.toggleShipmentList && state.refetch.shipmentIds.length > 0) {
          const [newShipmentId] = state.refetch.shipmentIds;
          const queryOption: any = {
            query: shipmentDetailQuery,
            variables: {
              id: newShipmentId,
            },
          };
          client.query(queryOption).then(() => {
            refetch(queryVariables).then(() => {
              scrollIntoView({
                targetId: `shipment-${newShipmentId}`,
              });
            });
          });
        }

        return (
          <InfiniteScroll
            className={ShipmentListBodyStyle}
            loadMore={() => loadMore({ fetchMore, data }, queryVariables, 'shipments')}
            hasMore={hasMoreItems(data, 'shipments')}
            loader={<LoadingIcon key="loadingShipment" />}
            useWindow={false}
            threshold={500}
          >
            {getByPathWithDefault([], 'shipments.nodes', data).map(shipment => (
              <Shipment
                wrapperClassName={ItemWrapperStyle(
                  highLightEntities.includes(`${SHIPMENT}-${shipment.id}`),
                  uiSelectors.isTarget(SHIPMENT, shipment.id),
                  highlight.type === SHIPMENT && highlight.selectedId === shipment.id
                )}
                key={shipment.id}
                {...shipment}
              />
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
        );
      }}
    </Query>
  );
}

export default injectIntl(ShipmentList);
