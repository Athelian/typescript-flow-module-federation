// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { flatten } from 'lodash';
import logger from 'utils/logger';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, MoveButton } from 'components/Buttons';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { moveEntityMutation } from './mutation';
import {
  OrderLabelIcon,
  ItemLabelIcon,
  ItemsLabelIcon,
  BatchLabelIcon,
  BatchesLabelIcon,
  ContainerLabelIcon,
  ShipmentLabelIcon,
} from '../ActionDialog';

type Props = {
  onSuccess: (ids: Array<string>) => void,
};

const labelMapping = {
  ORDER: <OrderLabelIcon />,
  ORDER_ITEM: <ItemLabelIcon />,
  ORDER_ITEMS: <ItemsLabelIcon />,
  BATCH: <BatchLabelIcon />,
  BATCHES: <BatchesLabelIcon />,
  CONTAINER: <ContainerLabelIcon />,
  SHIPMENT: <ShipmentLabelIcon />,
};

export default function MoveEntityConfirm({ onSuccess }: Props) {
  const { dispatch, state } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const {
    isProcessing,
    isOpen,
    detail: { from, to },
  } = state.moveEntity;
  const onCancel = () => {
    dispatch({
      type: 'CANCEL_MOVE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'CONFIRM_MOVE_START',
      payload: {},
    });
    moveEntityMutation(state, mapping.entities)
      .then(ids => onSuccess(flatten(ids).filter(Boolean)))
      .catch(error => {
        logger.warn({
          error,
        });
        dispatch({
          type: 'CONFIRM_MOVE_END',
          payload: {},
        });
      });
  };
  const isMulti = ['BATCHES', 'ORDER_ITEMS'].includes(from.icon);
  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      {isOpen && (
        <div className={DialogStyle}>
          <h3 className={ConfirmMessageStyle}>
            {isMulti ? (
              <FormattedMessage
                id="modules.RelationMap.dnd.confirmMoveMultiMessage"
                defaultMessage="Are you sure you want to move these {total} {fromLabel} to an existing {toLabel} {to}?"
                values={{
                  fromLabel: labelMapping[from.icon] || labelMapping[0],
                  toLabel: labelMapping[to.icon] || labelMapping[0],
                  total: from.value,
                  to: to.value,
                }}
              />
            ) : (
              <FormattedMessage
                id="modules.RelationMap.dnd.confirmMoveMessage"
                defaultMessage="Are you sure you want to move {fromLabel} {from} to an existing {toLabel} {to}?"
                values={{
                  fromLabel: labelMapping[from.icon] || labelMapping[0],
                  toLabel: labelMapping[to.icon] || labelMapping[0],
                  from: from.value,
                  to: to.value,
                }}
              />
            )}
          </h3>
          {isProcessing && <LoadingIcon />}
          <div className={ButtonsStyle}>
            <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
            <MoveButton disabled={Boolean(isProcessing)} onClick={onConfirm} />
          </div>
        </div>
      )}
    </Dialog>
  );
}
