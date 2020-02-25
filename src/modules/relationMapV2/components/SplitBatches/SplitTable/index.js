// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, Display, NumberInputFactory } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { findActiveQuantityField, getBatchLatestQuantity } from 'utils/batch';
import messages from 'modules/batch/messages';
import { useNumberInput } from 'modules/form/hooks';
import validator from '../validator';
import {
  SplitTableWrapperStyle,
  LeftSideWrapperStyle,
  LeftTableWrapperStyle,
  LeftRowStyle,
  TableCellStyle,
  RightSideWrapperStyle,
  RightTableWrapperStyle,
  RightRowStyle,
} from './style';

type SplitRowProps = {
  selectedBatch: Object,
  onChange: (string, { no: string, quantity: number }) => void,
};

function SplitRow({ selectedBatch, onChange }: SplitRowProps) {
  const { id } = selectedBatch;
  const latestQuantity = getBatchLatestQuantity(selectedBatch);

  const validation = validator(0, latestQuantity);
  const { hasError, touch, ...inputHandlers } = useNumberInput(0, {
    isRequire: false,
  });
  return (
    <div className={RightRowStyle}>
      <NumberInputFactory
        name={`split-batch-${id}`}
        originalValue={0}
        isNew
        editable
        inputWidth="200px"
        inputHeight="30px"
        {...inputHandlers}
        onBlur={evt => {
          inputHandlers.onBlur(evt);
          onChange(id, { quantity: inputHandlers.value || 0 });
        }}
        isTouched={touch}
        errorMessage={
          !validation.isValidSync({ quantity: inputHandlers.value }) && (
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
    </div>
  );
}

type Props = {|
  selectedBatches: Array<Object>,
  onChange: (string, { no: string, quantity: number }) => void,
|};

export default function SplitTable({ selectedBatches, onChange }: Props) {
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
                    Order No
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    Item No
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    Product Name
                  </Display>
                </div>

                <div className={TableCellStyle}>
                  <Display height="30px" width="200px">
                    Product Serial
                  </Display>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={RightSideWrapperStyle}>
        <Label height="30px">
          <FormattedMessage
            id="modules.RelationMap.split.batchesSplittingOff"
            defaultMessage="Batches Splitting Off"
          />
        </Label>

        <div className={RightTableWrapperStyle}>
          <div className={RightRowStyle}>
            <Label height="30px" width="200px">
              <FormattedMessage {...messages.batchNo} />
            </Label>

            <Label height="30px" width="200px">
              <FormattedMessage {...messages.quantity} />
            </Label>
          </div>

          {selectedBatches.map(selectedBatch => {
            return <SplitRow selectedBatch={selectedBatch} onChange={onChange} />;
          })}
        </div>
      </div>
    </div>
  );
}
