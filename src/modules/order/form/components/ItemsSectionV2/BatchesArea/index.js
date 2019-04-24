// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
// import { BooleanValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { NewButton, BaseButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import { OrderBatchCard } from 'components/Cards';
import Icon from 'components/Icon';
// import { CardAction } from 'components/Cards';
// import RemoveDialog from 'components/Dialog/RemoveDialog';
// import { injectUid } from 'utils/id';
// import { getByPath } from 'utils/fp';
import { ORDER_UPDATE } from 'modules/permission/constants/order';
// import { PRODUCT_FORM } from 'modules/permission/constants/product';
// import { ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import {
  BatchesAreaWrapperStyle,
  BatchesNavbarWrapperStyle,
  BatchesBodyWrapperStyle,
  BatchesHeaderWrapperStyle,
  BatchesTitleWrapperStyle,
  IconStyle,
  TitleStyle,
  AutofillButtonWrapperStyle,
  BatchesGridStyle,
  BatchesFooterWrapperStyle,
} from './style';

type Props = {
  itemsIsExpanded: boolean,
  batches: Array<Object>,
  setFieldValue: (string, any) => void,
  setFieldTouched: Function,
  focusedItemIndex: number,
};

function ItemsArea({
  itemsIsExpanded,
  batches,
  setFieldValue,
  setFieldTouched,
  focusedItemIndex,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowUpdate = hasPermission(ORDER_UPDATE);

  console.log({ allowUpdate, setFieldValue, setFieldTouched });

  return (
    <div className={BatchesAreaWrapperStyle(itemsIsExpanded)}>
      <div className={BatchesNavbarWrapperStyle} />

      <div className={BatchesBodyWrapperStyle}>
        <div className={BatchesHeaderWrapperStyle(itemsIsExpanded)}>
          <div className={BatchesTitleWrapperStyle}>
            <div className={IconStyle}>
              <Icon icon="BATCH" />
            </div>

            <div className={TitleStyle}>
              {focusedItemIndex === -1 ? (
                <FormattedMessage id="modules.Orders.allBatches" defaultMessage="ALL BATCHES" />
              ) : (
                <FormattedMessage id="modules.Orders.batches" defaultMessage="BATCHES" />
              )}
              {' ('}
              <FormattedNumber value={batches.length} />
              {')'}
            </div>
          </div>

          <div className={AutofillButtonWrapperStyle}>
            {batches.length > 0 && (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.Orders.autofillBatch"
                    defaultMessage="AUTOFILL BATCH"
                  />
                }
                onClick={() => {
                  if (focusedItemIndex === -1) {
                    // Autofill all items
                  } else {
                    // Autofill in current item
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className={BatchesGridStyle}>
          {batches.map(batch => {
            return <OrderBatchCard key={batch.id} batch={batch} />;
          })}
        </div>
      </div>

      <div className={BatchesFooterWrapperStyle}>
        {focusedItemIndex >= 0 && (
          <NewButton
            label={<FormattedMessage id="modules.Orders.newBatch" defaultMessage="NEW BATCH" />}
            onClick={() => {
              // Generate new batch
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ItemsArea;
