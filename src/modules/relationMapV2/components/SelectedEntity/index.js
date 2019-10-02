// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import { Label } from 'components/Form';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { targetedIds } from '../OrderFocus/helpers';
import {
  SelectedEntitiesWrapperStyle,
  EntitiesWrapperStyle,
  EntityWrapperStyle,
  EntityIconStyle,
  EntityCountStyle,
  ClearEntityButtonStyle,
  TotalEntitiesStyle,
  ClearTotalButtonStyle,
} from './style';

export default function SelectedEntity() {
  const { state, dispatch } = React.useContext(RelationMapContext);
  const orderIds = targetedIds(state.targets, ORDER);
  const orderItemIds = targetedIds(state.targets, ORDER_ITEM);
  const batchIds = targetedIds(state.targets, BATCH);
  const containerIds = targetedIds(state.targets, CONTAINER);
  const shipmentIds = targetedIds(state.targets, SHIPMENT);
  const orderCount = orderIds.length;
  const itemCount = orderItemIds.length;
  const batchCount = batchIds.length;
  const containerCount = containerIds.length;
  const shipmentCount = shipmentIds.length;
  const totalCount = orderCount + itemCount + batchCount + containerCount + shipmentCount;

  return (
    <div className={SelectedEntitiesWrapperStyle}>
      <div className={EntitiesWrapperStyle}>
        <div className={EntityWrapperStyle(orderCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="ORDER" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={orderCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              dispatch({
                type: 'REMOVE_TARGETS',
                payload: {
                  targets: orderIds.map(id => `${ORDER}-${id}`),
                },
              });
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>

        <div className={EntityWrapperStyle(itemCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="ORDER_ITEM" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={itemCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              dispatch({
                type: 'REMOVE_TARGETS',
                payload: {
                  targets: orderItemIds.map(id => `${ORDER_ITEM}-${id}`),
                },
              });
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>

        <div className={EntityWrapperStyle(batchCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="BATCH" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={batchCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              dispatch({
                type: 'REMOVE_TARGETS',
                payload: {
                  targets: batchIds.map(id => `${BATCH}-${id}`),
                },
              });
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>

        <div className={EntityWrapperStyle(containerCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="CONTAINER" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={containerCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              dispatch({
                type: 'REMOVE_TARGETS',
                payload: {
                  targets: containerIds.map(id => `${CONTAINER}-${id}`),
                },
              });
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>

        <div className={EntityWrapperStyle(shipmentCount)}>
          <div className={EntityIconStyle}>
            <Icon icon="SHIPMENT" />
          </div>
          <div className={EntityCountStyle}>
            <FormattedNumber value={shipmentCount} />
          </div>
          <button
            className={ClearEntityButtonStyle}
            onClick={() => {
              dispatch({
                type: 'REMOVE_TARGETS',
                payload: {
                  targets: shipmentIds.map(id => `${SHIPMENT}-${id}`),
                },
              });
            }}
            type="button"
          >
            <Icon icon="CLEAR" />
          </button>
        </div>
      </div>

      <div className={TotalEntitiesStyle}>
        <Label color="TEAL" align="center">
          <FormattedNumber value={totalCount} />
          <FormattedMessage id="modules.relationalMap.selected" defaultMessage="SELECTED" />
        </Label>
        <button
          className={ClearTotalButtonStyle}
          onClick={() => {
            dispatch({
              type: 'REMOVE_TARGETS',
              payload: {
                targets: [
                  ...orderIds.map(id => `${ORDER}-${id}`),
                  ...orderItemIds.map(id => `${ORDER_ITEM}-${id}`),
                  ...batchIds.map(id => `${BATCH}-${id}`),
                  ...containerIds.map(id => `${CONTAINER}-${id}`),
                  ...shipmentIds.map(id => `${SHIPMENT}-${id}`),
                ],
              },
            });
          }}
          type="button"
        >
          <Icon icon="CLEAR" />
        </button>
      </div>
    </div>
  );
}
