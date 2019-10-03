// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAllHasPermission } from 'components/Context/Permissions';
import { useMutation } from '@apollo/react-hooks';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import { BATCH } from 'modules/relationMapV2/constants';
import { BATCH_UPDATE } from 'modules/permission/constants/batch';
import { BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import { FieldItem, DefaultStyle, Label, Display, NumberInput, FormTooltip } from 'components/Form';
import ActionDialog, { BatchesLabelIcon, BatchLabelIcon } from '../ActionDialog';
import { batchSimpleSplitMutation } from './mutation';
import { SplitInputsWrapperStyle, SplitRowStyle } from './style';
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
    <div className={SplitRowStyle}>
      <Display height="30px">{no}</Display>

      <Display height="30px">
        <FormattedNumber value={latestQuantity} />
      </Display>

      <FieldItem
        input={
          // TODO: Use proper number input like the ones we use in our forms
          <DefaultStyle type="number" width="200px">
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
                    min: 1,
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
  const hasPermission = useAllHasPermission(
    batchIds.map(id => mapping.entities?.batches?.[id]?.ownedBy).filter(Boolean)
  );
  const totalBatches = batchIds.length;
  const DEFAULT_QTY = 0;
  const [batches, setBatches] = React.useState(batchIds.map(id => ({ id, quantity: DEFAULT_QTY })));
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
    return (
      batches.length > 0 &&
      batches.every(({ id, quantity }) =>
        validator(1, mapping.entities?.batches?.[id]?.latestQuantity ?? 0).isValidSync({
          quantity,
        })
      )
    );
  };

  // TODO: Replace with real logic
  const allHasNoQuantity = false;

  const allowToUpdate = () => {
    return hasPermission(BATCH_UPDATE);
  };

  const noPermission = !allowToUpdate();

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (noPermission) {
    // No permission to split
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.split.noPermission"
        defaultMessage="At least one {batchLabel} selected does not allow you to split."
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else if (isProcessing) {
    // Is currently splitting
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.split.splitting"
        defaultMessage="Splitting {numOfBatches} {batchesLabel} ..."
        values={{
          numOfBatches: <FormattedNumber value={totalBatches} />,
          batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
        }}
      />
    );
  } else if (allHasNoQuantity) {
    // Has permission to split but no batches have more than 0 quantity
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.split.notEnoughQuantity"
        defaultMessage="None of the {batchesLabel} selected have quantities greater than 0"
        values={{ batchesLabel: <BatchesLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else {
    // Has permission to split and can split
    dialogMessage = (
      <>
        <FormattedMessage
          id="modules.RelationMap.split.message1a"
          defaultMessage="You have selected {numOfBatches} {batchesLabel}"
          values={{
            numOfBatches: <FormattedNumber value={totalBatches} />,
            batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
          }}
        />
        <div>
          <FormattedMessage
            id="modules.RelationMap.split.message1b"
            defaultMessage="Please enter the quantities that you would like to split by"
          />
        </div>
      </>
    );
    dialogSubMessage = (
      <>
        <FormattedMessage
          id="modules.RelationMap.split.message2a"
          defaultMessage="You cannot split by more than the quantity of each {batchLabel}"
          values={{ batchLabel: <BatchLabelIcon /> }}
        />
        <div>
          <FormattedMessage
            id="modules.RelationMap.split.message2b"
            defaultMessage="If quantity to split into is set as 0, it will be ignored"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <ActionDialog
        isOpen={isOpen}
        isProcessing={isProcessing}
        onCancel={onCancel}
        title={<FormattedMessage id="modules.RelationMap.label.split" defaultMessage="SPLIT" />}
        dialogMessage={dialogMessage}
        dialogSubMessage={dialogSubMessage}
        buttons={
          <BaseButton
            label={<FormattedMessage id="modules.RelationMap.label.split" defaultMessage="SPLIT" />}
            icon="SPLIT"
            disabled={noPermission || !isValid() || allHasNoQuantity}
            onClick={onConfirm}
          />
        }
      >
        {!allHasNoQuantity && (
          <div className={SplitInputsWrapperStyle}>
            <div className={SplitRowStyle}>
              <Label>
                <FormattedMessage id="components.BatchItem.batchNo" />
              </Label>

              <Label>
                <FormattedMessage id="components.BatchItem.quantity" />
              </Label>

              <Label>
                <FormattedMessage
                  id="modules.RelationMap.label.splitInto"
                  defaultMessage="Quantity to Split Into"
                />
              </Label>
            </div>

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
          </div>
        )}
      </ActionDialog>
    </>
  );
}
