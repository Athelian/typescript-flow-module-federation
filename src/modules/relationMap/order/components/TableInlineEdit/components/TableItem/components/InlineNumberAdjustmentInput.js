// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import emitter from 'utils/emitter';
import { oldGetBatchLatestQuantity as getBatchLatestQuantity } from 'utils/batch';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { NewButton } from 'components/Buttons';
import { RemoveAssignmentButtonStyle } from 'modules/shipment/form/components/TimelineSection/components/TimelineInfoSection/style';
import InlineSelectEnumInput from './InlineSelectEnumInput';
import InlineNumberInput from './InlineNumberInput';
import { InlineRowStyle } from './style';

type OptionalProps = {
  isRequired: boolean,
  value: ?{
    quantity: number,
    type: string,
  },
};

type Props = OptionalProps & {
  name: string,
  id: string,
  values: Object,
};

const defaultProps = {
  isRequired: false,
  value: null,
};

export default function InlineNumberAdjustmentInput({
  name,
  value,
  isRequired,
  id,
  values,
}: Props) {
  const hasQuantityYet = !!value;
  const { quantity, batchQuantityRevisions } = values;
  const numOfBatchAdjustments = Array.isArray(batchQuantityRevisions)
    ? batchQuantityRevisions.length
    : 0;
  const isLastAdjustment = Number(name.charAt(name.length - 1)) === numOfBatchAdjustments - 1;

  return hasQuantityYet ? (
    <div className={InlineRowStyle}>
      <InlineSelectEnumInput
        // TODO: need to support the 2 inputs on a cell
        id={`type-${id}`}
        name={`${name}.type`}
        value={value && value.type ? value.type : ''}
        enumType="BatchQuantityRevisionType"
        isRequired={isRequired}
        width="97.5px"
      />
      <InlineNumberInput
        id={id}
        name={`${name}.quantity`}
        value={value && value.quantity ? value.quantity : 0}
        isRequired={isRequired}
        width="97.5px"
      />
      {isLastAdjustment && (
        <button
          className={RemoveAssignmentButtonStyle}
          onClick={() => {
            emitter.emit('INLINE_CHANGE', {
              name: name.substring(0, name.length - 2),
              hasError: false,
              value: batchQuantityRevisions.slice(0, numOfBatchAdjustments - 1),
            });
          }}
          type="button"
        >
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  ) : (
    <Tooltip
      message={
        <FormattedMessage
          id="modules.RelationalMap.batchAdjustmentNewButton"
          defaultMessage="Create a New Quantity. Note: The quantity will automatically be set using the previous quantity."
        />
      }
    >
      <div>
        {/* $FlowFixMe This comment suppresses an error found when upgrading
         * Flow to v0.112.0. To view the error, delete this comment and run
         * Flow. */}
        <NewButton
          label={
            <FormattedMessage id="components.button.newQuantity" defaultMessage="NEW QUANTITY" />
          }
          onClick={() => {
            emitter.emit('INLINE_CHANGE', {
              name,
              hasError: false,
              value: {
                quantity: getBatchLatestQuantity({ quantity, batchQuantityRevisions }),
                type: 'Other',
              },
            });
          }}
          id={`input-${id}`}
        />
      </div>
    </Tooltip>
  );
}

InlineNumberAdjustmentInput.defaultProps = defaultProps;
