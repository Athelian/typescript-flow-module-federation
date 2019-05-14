// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import usePermission from 'hooks/usePermission';
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
};

function BatchesSection({ itemInfo, itemIsArchived }: Props) {
  const { hasPermission } = usePermission();
  const allowUpdate = hasPermission(ORDER_ITEMS_UPDATE);

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
                {allowUpdate && (
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
                                />
                              )}
                            </SlideView>
                            <div className={ItemStyle}>
                              <OrderBatchCard
                                editable={allowUpdate}
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
                                onClone={value =>
                                  setFieldValue('batches', [...batches, generateCloneBatch(value)])
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
