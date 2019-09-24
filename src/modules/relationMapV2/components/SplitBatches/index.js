// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import { BATCH } from 'modules/relationMapV2/constants';
import { SaveButton, CancelButton } from 'components/Buttons';
import Dialog from 'components/Dialog';
import Icon from 'components/Icon';
import { FieldItem, DefaultStyle, Label, NumberInput, FormTooltip } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import { batchSimpleSplitMutation } from './mutation';
import { DialogStyle, ButtonsStyle, ConfirmMessageStyle, BatchInputStyle } from './style';
import validator from './validator';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: (orderIds: Array<string>, batchIds: Object) => void,
|};

function SplitBatch({
  quantity,
  no,
  latestQuantity,
  onChange,
}: {|
  no: string,
  quantity: number,
  latestQuantity: number,
  onChange: (quantity: number) => void,
|}) {
  const validation = validator(0, latestQuantity);
  return (
    <div className={BatchInputStyle}>
      <FieldItem
        label={
          <Label width="min-content" align="right">
            <FormattedMessage
              id="components.cards.splitQuantityForBatch"
              defaultMessage="QTY FOR BATCH"
            />
            <Icon icon="BATCH" /> {no}
          </Label>
        }
        input={
          <DefaultStyle type="number" width="160px">
            <NumberInput
              min={0}
              max={latestQuantity}
              value={quantity}
              onChange={evt => onChange(evt.target.value)}
            />
          </DefaultStyle>
        }
        tooltip={
          <FormTooltip
            isNew={false}
            errorMessage={
              !validation.isValidSync({ quantity }) && (
                <FormattedMessage
                  id="modules.RelationMap.split.validationError"
                  defaultMessage="Please enter the number between {min} and {max}"
                  values={{
                    min: 0,
                    max: latestQuantity,
                  }}
                />
              )
            }
          />
        }
      />
    </div>
  );
}

export default function SplitBatches({ onSuccess }: Props) {
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = React.useContext(RelationMapContext);
  const [batchSimpleSplit] = useMutation(batchSimpleSplitMutation);
  const {
    targets,
    split: { isOpen, isProcessing },
  } = state;
  const batchIds = targetedIds(targets, BATCH);
  const DEFAULT_QTY = 0;
  const [batches, setBatches] = React.useState(() =>
    batchIds.map(id => ({ id, quantity: DEFAULT_QTY }))
  );
  React.useEffect(() => {
    return () => {
      if (!isOpen) setBatches([]);
    };
  }, [isOpen]);
  const onCancel = React.useCallback(() => {
    dispatch({
      type: 'SPLIT_END',
      payload: {},
    });
  }, [dispatch]);

  const getQuantity = (batchId: string) => {
    const findBatch = batches.find(batch => batch.id === batchId);
    return findBatch?.quantity ?? DEFAULT_QTY;
  };

  const onConfirm = () => {
    dispatch({
      type: 'SPLIT_START',
      payload: {},
    });
    Promise.all(
      batches.map(({ id, quantity }) =>
        batchSimpleSplit({
          variables: { id, input: { quantity } },
        })
      )
    )
      .then(result => {
        const orderIds = [];
        const batchesIds = {};
        result.forEach(({ data }) => {
          const batchList = data?.batchSimpleSplit?.batches ?? [];
          if (batchList.length) {
            const [batch, newBatch] = batchList;
            if (batch?.id ?? '') batchesIds[batch?.id ?? ''] = newBatch?.id;
            orderIds.push(batch?.orderItem?.order?.id);
          }
        });
        onSuccess(orderIds, batchesIds);
      })
      .catch(onCancel);
  };

  const isValid = () => {
    return batches.every(({ id, quantity }) =>
      validator(0, mapping.entities?.batches?.[id]?.latestQuantity ?? 0).isValidSync({
        quantity,
      })
    );
  };

  return (
    <Dialog isOpen={isOpen} width="500px">
      {isOpen && (
        <div className={DialogStyle}>
          {isProcessing ? (
            <>
              <h3 className={ConfirmMessageStyle}>
                Split {batchIds.length} batches <Icon icon="BATCH" /> ...
              </h3>
              <LoadingIcon />
            </>
          ) : (
            <>
              <h3 className={ConfirmMessageStyle}>
                You hae selected {batchIds.length} batches <Icon icon="BATCH" />
                Please enter the quantity you would like to split each Batch
                <Icon icon="BATCH" /> into. (Splitting into 0 quantity will simply clone it)
              </h3>
              {batchIds.map(batchId => (
                <SplitBatch
                  key={batchId}
                  onChange={quantity =>
                    setBatches([
                      ...batches.filter(batch => batch?.id !== batchId),
                      { id: batchId, quantity },
                    ])
                  }
                  no={mapping.entities?.batches?.[batchId]?.no ?? ''}
                  latestQuantity={mapping.entities?.batches?.[batchId]?.latestQuantity ?? 0}
                  quantity={getQuantity(batchId)}
                />
              ))}
              <div className={ButtonsStyle}>
                <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
                <SaveButton
                  isLoading={Boolean(isProcessing)}
                  disabled={Boolean(isProcessing) || !isValid()}
                  onClick={onConfirm}
                />
              </div>
            </>
          )}
        </div>
      )}
    </Dialog>
  );
}
