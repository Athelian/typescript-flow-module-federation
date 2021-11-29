// @flow
import * as React from 'react';
import type { PartnerPayload } from 'generated/graphql';
import { useLazyQuery } from '@apollo/react-hooks';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import { orderFormItemsQuery } from 'modules/order/form/components/ItemsSection/query';
import useUser from 'hooks/useUser';
import { getUpdatedTags } from 'modules/shipment/form/components/CleanUpShipment/helpers';

type Props = {|
  isNew: boolean,
  orderId: string,
  orderItemsContainer: Object,
  orderInfoContainer: Object,
  orderTagsContainer: Object,
|};

type ChangeData = {|
  action: 'CHANGE_EXPORTER' | 'CHANGE_SHARED_PARTNERS',
  payload: {
    selectedExporter?: PartnerPayload,
    selectedOrganizations?: Array<PartnerPayload>,
  },
|};

export default function CleanUpOrder({
  isNew,
  orderId,
  orderInfoContainer,
  orderTagsContainer,
  orderItemsContainer,
}: Props) {
  const [queryOrderDetail, { data, called, loading }] = useLazyQuery(orderFormItemsQuery);
  const { user } = useUser();

  const changeDataRef = React.useRef<ChangeData | null>(null);

  React.useEffect(() => {
    if (called && !loading) {
      const orderItems = data?.order?.orderItems ?? [];
      if (!orderItemsContainer.state.hasCalledItemsApiYet) {
        orderItemsContainer.initDetailValues(orderItems, true, user.timezone);
      }

      const { action } = changeDataRef.current ?? { action: '', payload: {} };

      switch (action) {
        case 'CHANGE_EXPORTER':
          orderItemsContainer.changeExporter();
          break;

        default:
          logger.warn('not support yet', action);
          break;
      }
    }
  }, [orderItemsContainer, called, data, loading, user]);

  React.useEffect(() => {
    emitter.addListener('CLEAN_ORDERS', changeData => {
      const { action, payload }: ChangeData = (changeData: any);
      if (!isNew && !orderItemsContainer.state.hasCalledItemsApiYet) {
        changeDataRef.current = (changeData: any);
        queryOrderDetail({
          variables: {
            id: orderId,
          },
        });
      } else {
        switch (action) {
          case 'CHANGE_EXPORTER':
            {
              orderItemsContainer.changeExporter();

              const updatedTags = getUpdatedTags({
                infoContainer: orderInfoContainer,
                tagsContainer: orderTagsContainer,
                newValue: payload.selectedExporter,
                field: 'exporter',
              });

              orderTagsContainer.setFieldValue('tags', updatedTags);
            }
            break;
          case 'CHANGE_SHARED_PARTNERS':
            {
              const updatedTags = getUpdatedTags({
                infoContainer: orderInfoContainer,
                tagsContainer: orderTagsContainer,
                newValue: payload.selectedOrganizations,
                field: 'organizations',
              });

              orderTagsContainer.setFieldValue('tags', updatedTags);
            }
            break;
          default:
            logger.warn('not support yet', action);
            break;
        }
      }
    });
    return () => {
      emitter.removeAllListeners('CLEAN_ORDERS');
    };
  }, [
    orderItemsContainer,
    orderInfoContainer,
    orderTagsContainer,
    isNew,
    queryOrderDetail,
    orderId,
  ]);
  return null;
}
