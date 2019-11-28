// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { findActiveQuantityField, getBatchLatestQuantity } from 'utils/batch';
import { useNumberInput } from 'modules/form/hooks';
import FormattedNumber from 'components/FormattedNumber';
import { BaseButton } from 'components/Buttons';
import { Display, Label, NumberInputFactory } from 'components/Form';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { BatchLabelIcon } from 'components/Dialog/ActionDialog';
import batchMessages from 'modules/batch/messages';
import messages from '../messages';
import validator from './validator';
import batchSimpleSplitMutation from './mutation';
import { SplitInputsWrapperStyle, SplitRowStyle } from './style';

type Props = {|
  getBatch: (batchId: string, item: Object) => Object,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const BatchSplitActionImpl = ({ entity, item, onDone, getBatch }: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [batchSimpleSplit, { loading, called }] = useMutation(batchSimpleSplitMutation);

  const [quantity, setQuantity] = React.useState(0);

  const batch = getBatch(entity.id, item);
  const latestQuantity = getBatchLatestQuantity(batch);
  const latestQuantityField = findActiveQuantityField(batch);

  const onConfirm = () => {
    executeActionMutation(batchSimpleSplit, { id: entity.id, input: { quantity } }, close);
  };

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (loading || called) {
    dialogMessage = (
      <FormattedMessage
        {...messages.batchSplitSplitting}
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
  } else if (latestQuantity === 0) {
    dialogMessage = (
      <FormattedMessage
        {...messages.batchSplitNotEnoughQuantity}
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
  } else {
    dialogMessage = <FormattedMessage {...messages.batchSplitMessage} />;
    dialogSubMessage = (
      <FormattedMessage
        {...messages.batchSplitSubMessage}
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
  }

  const validation = validator(0, latestQuantity);
  const { hasError, touch, ...inputHandlers } = useNumberInput(0, { isRequire: false });
  const valid = validation.isValidSync({ quantity: inputHandlers.value });

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={loading || called}
      title={<FormattedMessage {...messages.batchSplitTitle} />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      onCancel={close}
      buttons={
        <BaseButton
          label={<FormattedMessage {...messages.batchSplitButton} />}
          icon="SPLIT"
          disabled={latestQuantity === 0 || !valid || quantity === 0}
          onClick={onConfirm}
        />
      }
    >
      {latestQuantity !== 0 && (
        <div className={SplitInputsWrapperStyle}>
          <div className={SplitRowStyle}>
            <Label>
              <FormattedMessage {...batchMessages.batchNo} />
            </Label>

            <Label>
              <FormattedMessage {...batchMessages[latestQuantityField]} />
            </Label>

            <Label>
              <FormattedMessage {...messages.batchSplitInto} />
            </Label>
          </div>
          <div className={SplitRowStyle}>
            <Display height="30px">{batch.no}</Display>

            <Display height="30px">
              <FormattedNumber value={latestQuantity} />
            </Display>

            <NumberInputFactory
              originalValue={0}
              isNew
              editable
              inputWidth="200px"
              inputHeight="30px"
              {...inputHandlers}
              onBlur={evt => {
                inputHandlers.onBlur(evt);
                setQuantity(inputHandlers.value || 0);
              }}
              isTouched={touch}
              errorMessage={
                !valid && (
                  <FormattedMessage
                    {...messages.batchSplitValidatorError}
                    values={{
                      min: 1,
                      max: latestQuantity,
                    }}
                  />
                )
              }
            />
          </div>
        </div>
      )}
    </ActionDialog>
  );
};

const BatchSplitAction = ({ getBatch }: Props) => (props: ActionComponentProps) => (
  <BatchSplitActionImpl {...props} getBatch={getBatch} />
);

export default BatchSplitAction;
