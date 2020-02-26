// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, Display, TextInputFactory, NumberInputFactory } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { findActiveQuantityField, getBatchLatestQuantity } from 'utils/batch';
import messages from 'modules/batch/messages';
import { useTextInput, useNumberInput } from 'modules/form/hooks';
import validator from '../validator';
import {
  SplitTableWrapperStyle,
  LeftSideWrapperStyle,
  LeftTableWrapperStyle,
  LeftRowStyle,
  TableCellStyle,
  RightSideWrapperStyle,
  RightTitleStyle,
  RightTableWrapperStyle,
  RightRowStyle,
} from './style';

type SplitRowProps = {
  splitBatch: Object,
  onChange: (string, { no: string, quantity: number }) => void,
  maxQuantity: number,
};

function SplitRow({ splitBatch, onChange, maxQuantity }: SplitRowProps) {
  const { id, no, quantity } = splitBatch;

  const validation = validator(0, maxQuantity);

  const { hasError: textHasError, ...textInputHandlers } = useTextInput(no, {
    isRequired: true,
  });

  const { hasError, touch, ...numberInputHandlers } = useNumberInput(quantity, {
    isRequired: false,
  });

  return (
    <div className={RightRowStyle}>
      <TextInputFactory
        name={`${id}.no`}
        originalValue={no}
        isNew
        editable
        isTouched
        inputWidth="200px"
        inputHeight="30px"
        {...textInputHandlers}
        onBlur={() => {
          textInputHandlers.onBlur();
          onChange(id, { ...splitBatch, no: textInputHandlers.value || '' });
        }}
        errorMessage={
          textHasError && <FormattedMessage id="components.BatchItem.validation.required" />
        }
      />

      <NumberInputFactory
        name={`split-batch-${id}`}
        originalValue={0}
        isNew
        editable
        inputWidth="200px"
        inputHeight="30px"
        isTouched
        {...numberInputHandlers}
        onBlur={evt => {
          numberInputHandlers.onBlur(evt);
          onChange(id, { ...splitBatch, quantity: numberInputHandlers.value || 0 });
        }}
        errorMessage={
          !validation.isValidSync({ no: 'valid', quantity: numberInputHandlers.value }) && (
            <FormattedMessage
              id="modules.RelationMap.split.validationError"
              defaultMessage="Please enter the number between {min} and {max}"
              values={{
                min: 1,
                max: maxQuantity,
              }}
            />
          )
        }
      />
    </div>
  );
}

type Props = {|
  selectedBatches: Array<Object>,
  splitBatches: Array<Object>,
  onChange: (string, { no: string, quantity: number }) => void,
|};

export default function SplitTable({ selectedBatches, splitBatches, onChange }: Props) {
  return (
    <div className={SplitTableWrapperStyle}>
      <div className={LeftSideWrapperStyle}>
        <Label height="30px">
          <FormattedMessage
            id="modules.RelationMap.split.selectedBatches"
            defaultMessage="Selected Batches"
          />
        </Label>

        <div className={LeftTableWrapperStyle}>
          <div className={LeftRowStyle}>
            <Label height="30px" width="200px">
              <FormattedMessage id="modules.RelationMap.split.batchNo" defaultMessage="Batch No" />
            </Label>

            <Label height="30px" width="200px">
              <FormattedMessage
                id="modules.RelationMap.split.currenQuantityType"
                defaultMessage="Current Quantity Type"
              />
            </Label>

            <Label height="30px" width="200px">
              <FormattedMessage id="modules.RelationMap.split.quantity" defaultMessage="Quantity" />
            </Label>

            <Label height="30px" width="200px">
              <FormattedMessage id="modules.RelationMap.split.orderNo" defaultMessage="Order No" />
            </Label>

            <Label height="30px" width="200px">
              <FormattedMessage id="modules.RelationMap.split.itemNo" defaultMessage="Item No" />
            </Label>

            <Label height="30px" width="200px">
              <FormattedMessage
                id="modules.RelationMap.split.productName"
                defaultMessage="Product Name"
              />
            </Label>

            <Label height="30px" width="200px">
              <FormattedMessage
                id="modules.RelationMap.split.productSerial"
                defaultMessage="Product Serial"
              />
            </Label>
          </div>

          {selectedBatches.map(selectedBatch => {
            const {
              id,
              no,
              producedQuantity,
              preShippedQuantity,
              shippedQuantity,
              postShippedQuantity,
              deliveredQuantity,
              orderNo,
              itemNo,
              productName,
              productSerial,
            } = selectedBatch;

            const currentQuantityType = findActiveQuantityField({
              producedQuantity,
              preShippedQuantity,
              shippedQuantity,
              postShippedQuantity,
              deliveredQuantity,
            });
            const currentQuantity = selectedBatch[currentQuantityType];

            return (
              <div className={LeftRowStyle} key={id}>
                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    {no}
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    <FormattedMessage {...messages[currentQuantityType]} />
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    <FormattedNumber value={currentQuantity} />
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    {orderNo}
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    {itemNo}
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    {productName}
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    {productSerial}
                  </Display>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={RightSideWrapperStyle}>
        <div className={RightTitleStyle}>
          <Label height="30px">
            <FormattedMessage
              id="modules.RelationMap.split.batchesSplittingOff"
              defaultMessage="Batches Splitting Off"
            />
          </Label>
        </div>

        <div className={RightTableWrapperStyle}>
          <div className={RightRowStyle}>
            <Label height="30px" width="200px">
              <FormattedMessage {...messages.batchNo} />
            </Label>

            <Label height="30px" width="200px">
              <FormattedMessage {...messages.quantity} />
            </Label>
          </div>

          {splitBatches.map(splitBatch => {
            return (
              <SplitRow
                key={splitBatch.id}
                splitBatch={splitBatch}
                onChange={onChange}
                maxQuantity={getBatchLatestQuantity(
                  selectedBatches.find(selectedBatch => selectedBatch.id === splitBatch.id)
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
