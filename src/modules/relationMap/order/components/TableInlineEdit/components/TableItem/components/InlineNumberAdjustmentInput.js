// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { NewButton } from 'components/Buttons';
import emitter from 'utils/emitter';
import Icon from 'components/Icon';
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
  const numOfBatchAdjustments = values.batchQuantityRevisions.length;
  const isLastAdjustment = Number(name.charAt(name.length - 1)) === numOfBatchAdjustments - 1;

  return hasQuantityYet ? (
    <div className={InlineRowStyle}>
      <InlineSelectEnumInput
        id={`input-${id}`}
        name={`${name}.type`}
        value={value && value.type ? value.type : ''}
        enumType="BatchQuantityRevisionType"
        isRequired={isRequired}
        width="97.5px"
      />
      <InlineNumberInput
        id={`input-${id}`}
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
              value: values.batchQuantityRevisions.slice(0, numOfBatchAdjustments - 1),
            });
          }}
          type="button"
        >
          <Icon icon="REMOVE" />
        </button>
      )}
    </div>
  ) : (
    <NewButton
      label={<FormattedMessage id="components.button.newQuantity" defaultMessage="NEW QUANTITY" />}
      onClick={() => {
        emitter.emit('INLINE_CHANGE', {
          name,
          hasError: false,
          value: {
            quantity: 0,
            type: 'Other',
          },
        });
      }}
      id={`input-${id}`}
    />
  );
}

InlineNumberAdjustmentInput.defaultProps = defaultProps;
