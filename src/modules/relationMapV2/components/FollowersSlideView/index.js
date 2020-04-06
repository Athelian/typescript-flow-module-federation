// @flow
import * as React from 'react';
import { useLazyQuery } from 'react-apollo';
import apolloClient from 'apollo';
import usePrevious from 'hooks/usePrevious';
// import useUser from 'hooks/useUser';
import SlideView from 'components/SlideView';
import StaffSelector from 'components/Followers/StaffSelector';
import { orderFullFocusDetailQuery } from 'modules/relationMapV2/query';
// import { ORDER, ORDER_ITEM, BATCH, SHIPMENT, CONTAINER } from 'modules/relationMapV2/constants';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import {
  // targetedIds,
  // findParentIdsByBatch,
  // findShipmentIdByContainer,
  findOrderIdByItem,
} from 'modules/relationMapV2/helpers';
// import { encodeId } from 'utils/id';
import emitter from 'utils/emitter';
// import logger from 'utils/logger';
import { isEquals } from 'utils/fp';
import { ordersAndShipmentsQuery } from './query';

type Props = {|
  onClose: (
    ?{
      moveToTop: boolean,
      id: string,
      type: string,
    }
  ) => void,
|};

const FollowersSlideView = ({ onClose }: Props) => {
  // const { isExporter, isImporter, isForwarder, organization } = useUser();
  const isReady = React.useRef(true);
  const { dispatch, state } = FocusedView.useContainer();
  // const [fetchOrdersAndShipments, { called, loading, data = {} }] = useLazyQuery(
  const [fetchOrdersAndShipments] = useLazyQuery(ordersAndShipmentsQuery, {
    fetchPolicy: 'no-cache',
  });
  const { type, selectedId: id } = state.edit;
  const { mapping } = Entities.useContainer();
  const onRequestClose = React.useCallback(() => {
    if (isReady.current) {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    const listener = emitter.addListener('MUTATION', (result: Object) => {
      isReady.current = !!result;
      // reload order if order or item updated on the form
      if (
        state.viewer === 'Order' &&
        (result?.data?.orderItemUpdate || result?.data?.orderUpdate)
      ) {
        if (result?.data?.orderUpdate?.id) {
          const orderId = result?.data?.orderUpdate?.id;
          if (orderId) {
            apolloClient
              .query({
                query: orderFullFocusDetailQuery,
                variables: {
                  ids: [orderId],
                },
              })
              .then(refetchResult => {
                dispatch({
                  type: 'FETCH_ORDERS',
                  payload: {
                    orders: refetchResult.data.ordersByIDs,
                  },
                });
              });
          }
        }

        if (result?.data?.orderItemUpdate?.id) {
          const orderItemId = result?.data?.orderItemUpdate?.id;
          if (orderItemId) {
            apolloClient
              .query({
                query: orderFullFocusDetailQuery,
                variables: {
                  ids: [
                    findOrderIdByItem({
                      viewer: 'ORDER',
                      orderItemId,
                      entities: mapping?.entities,
                    }),
                  ].filter(Boolean),
                },
              })
              .then(refetchResult => {
                dispatch({
                  type: 'FETCH_ORDERS',
                  payload: {
                    orders: refetchResult.data.ordersByIDs,
                  },
                });
              });
          }
        }
      }
    });
    return () => {
      listener.remove();
    };
  }, [dispatch, mapping, state.viewer]);

  const orderIds = state.edit.orderIds || [];
  const shipmentIds = state.edit.shipmentIds || [];
  const lastQueryVariables = usePrevious({
    orderIds,
    shipmentIds,
  });
  React.useEffect(() => {
    if (
      ['MOVE_BATCHES', 'MOVE_ITEMS'].includes(type) &&
      id !== '' &&
      !isEquals(lastQueryVariables, {
        orderIds,
        shipmentIds,
      })
    ) {
      fetchOrdersAndShipments({
        variables: {
          orderIds,
          shipmentIds,
        },
      });
    }
  }, [fetchOrdersAndShipments, id, lastQueryVariables, orderIds, shipmentIds, type]);

  return (
    <SlideView
      isOpen={id !== ''}
      onRequestClose={onRequestClose}
      shouldConfirm={() => {
        return !!document.querySelector('#resetBtn');
      }}
    >
      <StaffSelector
        selected={[]}
        onSelect={() => {
          console.log('onSelect');
        }}
        onCancel={() => {
          console.log('onCancel');
        }}
        organizationIds={[]}
      />
    </SlideView>
  );
};

export default FollowersSlideView;
