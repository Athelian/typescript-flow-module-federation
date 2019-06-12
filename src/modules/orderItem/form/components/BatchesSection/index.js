// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  BATCH_CREATE,
  BATCH_UPDATE,
  BATCH_DELETE,
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_QUANTITY_ADJUSTMENTS,
} from 'modules/permission/constants/batch';
import FormattedNumber from 'components/FormattedNumber';
import {
  findTotalAutoFillBatches,
  generateBatchByOrderItem,
  generateCloneBatch,
} from 'utils/batch';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';
import { OrderBatchCard } from 'components/Cards';
import { NewButton, BaseButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import { OrderItemBatchesContainer } from 'modules/orderItem/form/containers';
import BatchFormInSlide from 'modules/batch/common/BatchFormInSlide';
import { HIDE, NAVIGABLE } from 'modules/batch/constants';
import {
  BatchesSectionWrapperStyle,
  BatchesSectionBodyStyle,
  BatchesGridStyle,
  ItemStyle,
  EmptyMessageStyle,
} from './style';

type Props = {
  itemInfo: {
    quantity: ?number,
    price: ?Object,
    productProvider: ?Object,
  },
  itemIsArchived: boolean,
  isSlideView: boolean,
};

function BatchesSection({ itemInfo, itemIsArchived, isSlideView }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const allowCreateBatches = hasPermission(BATCH_CREATE);

  const allowCloneBatch = hasPermission(BATCH_CREATE);
  const allowDeleteBatch = hasPermission(BATCH_DELETE);
  const allowUpdateBatchNo = hasPermission([BATCH_UPDATE, BATCH_SET_NO]);
  const allowUpdateBatchQuantity =
    hasPermission(BATCH_UPDATE) ||
    (hasPermission(BATCH_SET_QUANTITY) && hasPermission(BATCH_SET_QUANTITY_ADJUSTMENTS));
  const allowUpdateBatchDelivery = hasPermission([BATCH_UPDATE, BATCH_SET_DELIVERY_DATE]);
  const allowUpdateBatchDesired = hasPermission([BATCH_UPDATE, BATCH_SET_DESIRED_DATE]);

  return (
    <Subscribe to={[OrderItemBatchesContainer]}>
      {({ state: { batches }, setFieldValue, setDeepFieldValue }) => {
        const values = { ...itemInfo, batches };
        return (
          <SectionWrapper id="orderItem_batchesSection">
            <SectionHeader
              icon="BATCH"
              title={
                <>
                  <FormattedMessage id="modules.OrderItems.batches" defaultMessage="BATCHES" /> (
                  <FormattedNumber value={batches.length} />)
                </>
              }
            />
            <div className={BatchesSectionWrapperStyle}>
              <SectionNavBar>
                {allowCreateBatches && (
                  <>
                    <NewButton
                      label={
                        <FormattedMessage
                          id="modules.OrderItems.newBatch"
                          defaultMessage="NEW BATCH"
                        />
                      }
                      onClick={() => {
                        setFieldValue('batches', [
                          ...batches,
                          {
                            ...generateBatchByOrderItem(values),
                            orderItem: itemInfo,
                            no: `batch no ${batches.length + 1}`,
                            archived: itemIsArchived,
                          },
                        ]);
                      }}
                    />
                    <BaseButton
                      label={
                        <FormattedMessage
                          id="modules.OrderItems.autoFillBatch"
                          defaultMessage="AUTOFILL BATCH"
                        />
                      }
                      onClick={() => {
                        const quantity = findTotalAutoFillBatches({
                          batches,
                          quantity: itemInfo.quantity || 0,
                        });
                        if (quantity > 0) {
                          const newBatch = {
                            ...generateBatchByOrderItem(itemInfo),
                            orderItem: itemInfo,
                            no: `batch no ${batches.length + 1}`,
                            quantity,
                          };
                          setFieldValue('batches', [...batches, newBatch]);
                        }
                      }}
                    />
                  </>
                )}
              </SectionNavBar>
              <div className={BatchesSectionBodyStyle}>
                {batches.length === 0 ? (
                  <div className={EmptyMessageStyle}>
                    <FormattedMessage
                      id="modules.container.noBatches"
                      defaultMessage="No batches found"
                    />
                  </div>
                ) : (
                  <div className={BatchesGridStyle}>
                    {batches.map((batch, index) => (
                      <BooleanValue key={batch.id}>
                        {({ value: opened, set: batchSlideToggle }) => (
                          <>
                            <SlideView
                              isOpen={opened}
                              onRequestClose={() => batchSlideToggle(false)}
                            >
                              {opened && (
                                <BatchFormInSlide
                                  batch={batch}
                                  onSave={value => {
                                    batchSlideToggle(false);
                                    setDeepFieldValue(`batches.${index}`, value);
                                  }}
                                  itemConfig={HIDE}
                                  shipmentConfig={NAVIGABLE}
                                  containerConfig={NAVIGABLE}
                                  orderConfig={isSlideView ? HIDE : NAVIGABLE}
                                />
                              )}
                            </SlideView>
                            <div className={ItemStyle}>
                              <OrderBatchCard
                                editable={{
                                  clone: allowCloneBatch,
                                  delete: allowDeleteBatch,
                                  no: allowUpdateBatchNo,
                                  quantity: allowUpdateBatchQuantity,
                                  deliveredAt: allowUpdateBatchDelivery,
                                  desiredAt: allowUpdateBatchDesired,
                                }}
                                batch={batch}
                                currency={itemInfo.price && itemInfo.price.currency}
                                price={itemInfo.price}
                                onClick={() => batchSlideToggle(true)}
                                saveOnBlur={value => setDeepFieldValue(`batches.${index}`, value)}
                                onRemove={() =>
                                  setFieldValue(
                                    'batches',
                                    batches.filter(item => item.id !== batch.id)
                                  )
                                }
                                onClone={newBatch =>
                                  setFieldValue('batches', [
                                    ...batches,
                                    generateCloneBatch(newBatch, hasPermission),
                                  ])
                                }
                              />
                            </div>
                          </>
                        )}
                      </BooleanValue>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
}

export default BatchesSection;
