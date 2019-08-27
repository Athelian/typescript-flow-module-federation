// @flow
import * as React from 'react';
import { flatten, flattenDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  ORDER,
  ORDER_ITEM,
  BATCH,
  CONTAINER,
  SHIPMENT,
  ORDER_WIDTH,
  ORDER_ITEM_WIDTH,
  BATCH_WIDTH,
  CONTAINER_WIDTH,
  SHIPMENT_WIDTH,
} from 'modules/relationMapV2/constants';
import { getByPathWithDefault } from 'utils/fp';
import { HeadingStyle, ButtonStyle, RowStyle } from './style';
import { RelationMapContext } from '../OrderFocus/store';

type Props = { style?: Object };

const Header = React.memo<Props>(({ style }: Props) => {
  const { state, orders, dispatch, entities } = React.useContext(RelationMapContext);
  return (
    <div style={style} className={RowStyle}>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#ED5724',
          width: ORDER_WIDTH,
        }}
      >
        Orders ({Object.keys(entities.orders || {}).length})
        <button
          type="button"
          className={ButtonStyle}
          onClick={() => {
            const targets = orders.map(
              order => `${ORDER}-${getByPathWithDefault('', 'id', order)}`
            );
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets,
              },
            });
          }}
        >
          <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
        </button>
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#FBAA1D',
          width: ORDER_ITEM_WIDTH,
        }}
      >
        Items ({Object.keys(entities.orderItems || {}).length})
        <button
          type="button"
          className={ButtonStyle}
          onClick={() => {
            const orderItemIds = flatten(
              orders.map(order =>
                getByPathWithDefault(
                  [],
                  `order.${getByPathWithDefault('', 'id', order)}.orderItems`,
                  state
                ).map(item => getByPathWithDefault('', 'id', item))
              )
            ).filter(Boolean);
            const targets = orderItemIds.map(id => `${ORDER_ITEM}-${id}`);
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets,
              },
            });
          }}
        >
          <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
        </button>
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#12B937',
          width: BATCH_WIDTH,
        }}
      >
        Batches ({Object.keys(entities.batches || {}).length})
        <button
          type="button"
          className={ButtonStyle}
          onClick={() => {
            const batchIds = flattenDeep(
              orders.map(order =>
                getByPathWithDefault(
                  [],
                  `order.${getByPathWithDefault('', 'id', order)}.orderItems`,
                  state
                ).map(item =>
                  getByPathWithDefault([], 'batches', item).map(batch =>
                    getByPathWithDefault('', 'id', batch)
                  )
                )
              )
            ).filter(Boolean);
            const targets = batchIds.map(id => `${BATCH}-${id}`);
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets,
              },
            });
          }}
        >
          <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
        </button>
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#30A8E4',
          width: CONTAINER_WIDTH,
        }}
      >
        Containers ({Object.keys(entities.containers || {}).length})
        <button
          type="button"
          className={ButtonStyle}
          onClick={() => {
            const containerIds = flattenDeep(
              orders.map(order =>
                getByPathWithDefault(
                  [],
                  `order.${getByPathWithDefault('', 'id', order)}.orderItems`,
                  state
                ).map(item =>
                  getByPathWithDefault([], 'batches', item).map(batch =>
                    getByPathWithDefault('', 'container.id', batch)
                  )
                )
              )
            ).filter(Boolean);
            const targets = containerIds.map(id => `${CONTAINER}-${id}`);
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets,
              },
            });
          }}
        >
          <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
        </button>
      </div>
      <div
        className={HeadingStyle}
        style={{
          backgroundColor: '#0756AF',
          width: SHIPMENT_WIDTH,
        }}
      >
        Shipments ({Object.keys(entities.shipments || {}).length})
        <button
          type="button"
          className={ButtonStyle}
          onClick={() => {
            const shipmentIds = flattenDeep(
              orders.map(order =>
                getByPathWithDefault(
                  [],
                  `order.${getByPathWithDefault('', 'id', order)}.orderItems`,
                  state
                ).map(item =>
                  getByPathWithDefault([], 'batches', item).map(batch =>
                    getByPathWithDefault('', 'shipment.id', batch)
                  )
                )
              )
            ).filter(Boolean);
            const targets = shipmentIds.map(id => `${SHIPMENT}-${id}`);
            dispatch({
              type: 'TARGET_ALL',
              payload: {
                targets,
              },
            });
          }}
        >
          <FormattedMessage id="components.button.SelectAll" defaultMessage="SELECT ALL" />
        </button>
      </div>
    </div>
  );
});

export default Header;
